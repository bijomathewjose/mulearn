import { AxiosError } from "axios";
import { privateGateway } from "@/MuLearnServices/apiGateways";
import { dashboardRoutes } from "@/MuLearnServices/urls";
import toast from "react-hot-toast";

export const getUserRoleVerification = async (
    setData: UseStateFunc<any>,
    page: number,
    selectedValue: number,
    setTotalPages?: UseStateFunc<number>,
    search?: string,
    sortID?: string
) => {
    try {
        const response = await privateGateway.get(
            dashboardRoutes.getUsersRoleVerificationData,
            {
                params: {
                    perPage: selectedValue,
                    pageIndex: page,
                    search: search,
                    sortBy: sortID
                }
            }
        );
        const manageusers: any = response?.data;
        //console.log(dashboardRoutes.getUsersRoleVerificationData);
        // setData(manageusers.response.data);
        const datasuser = manageusers.response.data;
        //console.log(datasuser);
        for (let i = 0; i < datasuser.length; i++) {
            if (datasuser[i].verified == false) {
                //console.log(datasuser[i].verified);
                datasuser[i].verified = "Not Verified";
            } else {
                //console.log(datasuser[i].verified);
                datasuser[i].verified = "Verified";
            }
        }
        setData(datasuser);
        //console.log(manageusers.response.data);
        if (setTotalPages)
            setTotalPages(manageusers.response.pagination.totalPages);
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
    console.log("table fetched");
};

export const editUserRoleVerification = async (
    verified: boolean,
    id: string | number | boolean
) => {
    try {
        const response = await privateGateway.patch(
            dashboardRoutes.getUsersRoleVerificationData + id + "/",
            {
                verified: verified
            }
        );
        const message: any = response?.data;
        //console.log(message);
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};

export const deleteUserRole = async (id: string | undefined) => {
    try {
        const response = await privateGateway.delete(
            dashboardRoutes.getUsersRoleVerificationData + id + "/"
        );
        const message: any = response?.data;
        toast.success("User deleted");
        console.log(message);
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};

interface IData {
    verified: boolean;
}
export const getUserRoleVerificationDetails = async (
    id: string,
    setData: UseStateFunc<IData>
) => {
    try {
        const response = await privateGateway.get(
            dashboardRoutes.getUsersData + "get/" + id + "/"
        );
        const message: any = response?.data;
        //console.log(message);
        //console.log(message.response.data);
        setData(message.response.data);
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};

export const deleteUserRoleVerification = async (id: string) => {
    try {
        const response = await privateGateway.delete(
            dashboardRoutes.getUsersData + id + "/"
        );

        toast.success("User deleted");
        const message: any = response?.data;
        //console.log(message);
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};
