import { useState, useMemo } from "react";
import { dashboardRoutes } from "@/MuLearnServices/urls";
import BulkImport from "@/MuLearnComponents/BulkImport/BulkImport";
import { PowerfulButton } from "@/MuLearnComponents/MuButtons/MuButton";
import { BiArrowBack, BiDownload } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { convertToXLSX } from "../../Tasks/TaskApis";
import { CountCard } from "../../Tasks/TaskBulkImport";
import { getKarmaVoucherTemplate } from "../service/api";
import toast from "react-hot-toast";

const KarmaVoucherBulkImport = () => {
    const [uploadResponse, setUploadResponse] = useState<any>(null);
    const navigate = useNavigate();

    const successDownload = () => {
        convertToXLSX(uploadResponse.response.Success, "Success.xlsx");
    };
    const failureDownload = () => {
        convertToXLSX(uploadResponse.response.Failed, "Failed.xlsx");
    };
    const memoizedSuccessDownload = useMemo(
        () => successDownload,
        [uploadResponse]
    );
    const memoizedFailureDownload = useMemo(
        () => failureDownload,
        [uploadResponse]
    );

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center"
                }}
            >
                <PowerfulButton
                    variant="secondary"
                    onClick={() => {
                        navigate("/dashboard/karma-voucher");
                    }}
                >
                    <BiArrowBack />
                    Go Back
                </PowerfulButton>
                <PowerfulButton
                    variant="secondary"
                    onClick={() => getKarmaVoucherTemplate()}
                >
                    <BiDownload />
                    Download Template
                </PowerfulButton>
            </div>
            <div>
                <BulkImport
                    path={dashboardRoutes.getKarmaVoucher + "import/"}
                    fileName="voucher_log"
                    onUpload={res => {
                        setUploadResponse(res);
                        toast.success("CSV upload successful");
                        // navigate("/dashboard/karma-voucher");
                    }}
                    onError={err => {
                        console.log(err);
                        setUploadResponse(err);
                        // navigate("/dashboard/karma-voucher");
                    }}
                />
                {uploadResponse && (
                    <>
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10rem"
                            }}
                        >
                            <CountCard
                                title="Success"
                                count={
                                    uploadResponse?.response?.Success?.length
                                }
                            />
                            <CountCard
                                title="Failed"
                                count={uploadResponse?.response?.Failed?.length}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "center",
                                gap: "1rem"
                            }}
                        >
                            <PowerfulButton
                                onClick={memoizedSuccessDownload}
                                variant="secondary"
                            >
                                Download Success data
                            </PowerfulButton>
                            <PowerfulButton
                                onClick={memoizedFailureDownload}
                                variant="secondary"
                            >
                                Download Failed data
                            </PowerfulButton>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default KarmaVoucherBulkImport;
