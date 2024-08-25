import { useEffect, useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getHackDetails } from "../services/HackathonApis";
import { PowerfulButton } from "@/MuLearnComponents/MuButtons/MuButton";
import styles from "./HackathonCreate.module.css";
import { DateConverter, convertDateToYYYYMMDD } from "../../../utils/common";
import MuLoader from "@/MuLearnComponents/MuLoader/MuLoader";
import { HackList } from "../services/HackathonInterfaces";
import { LuCopy } from "react-icons/lu";
import Countdown from "../../../utils/Countdown";
import toast from "react-hot-toast";

type Props = {};

// return true if possible
function isStillPossibleToApply(application: string | null) {
    if (application === null) return true;

    let now = new Date().getTime();
    let applicationTime = new Date(application).getTime();

    return applicationTime - now > 0;
}

export const HackathonDetails = (props: Props) => {
    const { id } = useParams();
    const [data, setData] = useState<HackList>();
    const navigate = useNavigate();

    const shareData = {
        title: data?.title || "not yet named",
        url: `${
            import.meta.env.VITE_FRONTEND_URL
        }/dashboard/hackathon/details/${data?.id || ""}`
    };
    const isShareable =
        window.navigator.canShare && window.navigator.canShare(shareData);

    useEffect(() => {
        getHackDetails(id || "")
            .then(res => {
                setData(res);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const targetDateTime = String(data?.application_ends);
    console.log(String(targetDateTime));
    const [remainingTime, setRemainingTime] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    return (
        <>
            {data ? (
                <div className={styles.hackathonDetails}>
                    <div className={styles.hackathonDetailDash}>
                        <img
                            className={styles.hackathonBanner}
                            src={`https://dev.mulearn.org/${data?.banner}`}
                            alt=""
                        />

                        <div className={styles.hackathonDesc}>
                            <div className={styles.description}>
                                <img
                                    className={styles.hackProfile}
                                    src={`https://dev.mulearn.org/${data?.event_logo}`}
                                />
                                <div className={styles.descTitle}>
                                    <div>
                                        <h1>{data?.title}</h1>
                                        <div className={styles.tagLine}>
                                            <b>{data?.tagline}</b>
                                            &nbsp;
                                            <b>
                                                {" "}
                                                {data?.participant_count}+
                                                participants
                                            </b>
                                        </div>
                                    </div>
                                    <span className={styles.love}></span>
                                </div>
                            </div>
                            <p>{data?.description}</p>
                        </div>
                    </div>

                    <div className={styles.hackathonEventCard}>
                        <div className={styles.hackathonApplyCard}>
                            <div className={styles.date}>
                                <span></span>
                                <div className={styles.hackathonEventDate}>
                                    <div>
                                        <b className={styles.title}>
                                            EVENT DATES
                                        </b>
                                        <h3>
                                            {DateConverter(
                                                convertDateToYYYYMMDD(
                                                    data?.event_start
                                                )
                                            )}{" "}
                                            <b style={{ color: "var(--blue)" }}>
                                                to
                                            </b>{" "}
                                            {DateConverter(
                                                convertDateToYYYYMMDD(
                                                    data?.event_end
                                                )
                                            )}
                                        </h3>
                                    </div>
                                    <div>
                                        <b className={styles.title}>
                                            HAPPENING AT
                                        </b>
                                        <h3>{data?.place}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.close}>
                                <b>APPLICATION CLOSING DATE</b>
                                <h4>
                                    {DateConverter(
                                        convertDateToYYYYMMDD(
                                            data?.application_ends
                                        )
                                    )}
                                </h4>
                                <Countdown
                                    targetDateTime={targetDateTime}
                                    remainingTime={remainingTime}
                                    setRemainingTime={setRemainingTime}
                                />
                            </div>
                            {isStillPossibleToApply(data.application_ends) ? (
                                <PowerfulButton
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/hackathon/apply/${data?.id}`
                                        )
                                    }
                                    children={"Apply Now"}
                                />
                            ) : (
                                <PowerfulButton
                                    variant="draft"
                                    disabled
                                    children={"Application Closed"}
                                />
                            )}
                        </div>
                        {data?.website && (
                            <div className={styles.socialLinks}>
                                <Link to={data?.website}>
                                    <PowerfulButton variant="secondary">
                                        <CiGlobe />
                                    </PowerfulButton>
                                </Link>
                                <PowerfulButton
                                    variant="secondary"
                                    onClick={() => {
                                        window.navigator.clipboard.writeText(
                                            shareData.url
                                        );

                                        toast.success(
                                            "Link copied to clipboard"
                                        );
                                        if (isShareable)
                                            window.navigator.share(shareData);
                                    }}
                                >
                                    <LuCopy />
                                </PowerfulButton>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.spinnerContainer}>
                    <div className={styles.spinner}>
                        <MuLoader />{" "}
                    </div>
                </div>
            )}
        </>
    );
};

export default HackathonDetails;
