import { AxiosError } from "axios";
import { privateGateway } from "@/MuLearnServices/apiGateways";
import { dashboardRoutes } from "@/MuLearnServices/urls";
import { roleUsers } from "./components/ManageUsers";
import toast from "react-hot-toast";

export const getManageRoles = async (
    setData?: UseStateFunc<any>,
    page?: number,
    selectedValue?: number,
    setIsLoading?: UseStateFunc<boolean>,
    setTotalPages?: UseStateFunc<any>,
    search?: string,
    sortID?: string
) => {
    if (setIsLoading) setIsLoading(true);
    try {
        const response = await privateGateway.get(
            dashboardRoutes.getRolesData,
            {
                params: {
                    perPage: selectedValue,
                    pageIndex: page,
                    search: search,
                    sortBy: sortID
                }
            }
        );
        const interestGroups: any = response?.data;
        if (setData && setIsLoading) {
            setData(interestGroups.response.data);
            if (setTotalPages)
                setTotalPages(interestGroups.response.pagination.totalPages);
            setIsLoading(false);
        } else {
            return interestGroups.response.data;
        }
    } catch (err: unknown) {
        if (setIsLoading) setIsLoading(false);
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};

export const createManageRoles = async (title: string, description: string) => {
    try {
        const response = await privateGateway.post(
            dashboardRoutes.getRolesData,
            {
                title: title,
                description: description
            }
        );

        const message: any = response?.data;
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};

export const editManageRoles = async (
    id: string | undefined,
    title: string,
    description: string
) => {
    try {
        const response = await privateGateway.patch(
            dashboardRoutes.getRolesData + id + "/",
            {
                title: title,
                description: description
            }
        );
        const message: any = response?.data;

        toast.success("Role edited");
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};
interface IData {
    title: string;
    description: string;
}
export const getManageRolesDetails = async (
    id: string | undefined,
    setData?: UseStateFunc<IData>
) => {
    try {
        const response = await privateGateway.patch(
            dashboardRoutes.getRolesData + id + "/"
        );
        const message: any = response?.data;
        if (setData) setData(message.response.data);
        else return message.response.data;
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};

export const deleteManageRoles = async (id: string | undefined) => {
    try {
        const response = await privateGateway.delete(
            dashboardRoutes.getRolesData + id + "/"
        );
        toast.success("Role deleted");
        const message: any = response?.data;
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};

//return true if rolename not used before and is available
export const isRoleUnique = (roleName: string, roles: string[]): boolean => {
    return roles.includes(roleName);
};

type ResultHandler = (msg: string) => void;
export const deleteUser = async (
    userId: string,
    roleId: string,
    error?: ResultHandler,
    success?: ResultHandler
) => {
    try {
        const res = await privateGateway.patch(
            dashboardRoutes.roleBulkAssign + roleId + "/",
            {
                users: [userId]
            }
        );
        if (success) success("User role removed");
    } catch (err) {
        if (err instanceof AxiosError) if (error) error(err.response?.data);
    }
};

export const addUsers = async (
    userIds: string[],
    roleId: string,
    error?: ResultHandler,
    success?: ResultHandler
) => {
    try {
        console.log(userIds);
        const res = await privateGateway.post(
            dashboardRoutes.roleBulkAssign + roleId + "/",
            {
                users: userIds
            }
        );
        if (success) success("User role added");
    } catch (err) {
        if (err instanceof AxiosError) if (error) error(err.response?.data);
    }
};

export const getUser = async (
    roleId: string,
    search: string,
    hasRole = true,
    error?: ResultHandler,
    success?: ResultHandler
) => {
    type userReqBody = {
        full_name: string;
        id: string;
        muid: string;
    };

    try {
        const res = hasRole
            ? await privateGateway.get(
                dashboardRoutes.roleBulkAssign + roleId + "/",
                {
                    params: {
                        search: search
                    }
                }
            )
            : await privateGateway.put(
                dashboardRoutes.roleBulkAssign + roleId + "/",
                null,
                {
                    params: {
                        search: search
                    }
                }
            );

        

        const data: roleUsers[] = res.data.response.map(
            (user: userReqBody) => ({
                label: user.muid,
                value: user.id
            })
            );

        return data;
    } catch (err) {
        if (err instanceof AxiosError) if (error) error(err.response?.data);
    }
};

// export const getUser = async (byRole = "") => {
//     //byRole to get users of certain role o.w all users
//     //temp values right now change when api routes are available
//     if (!!byRole) {
//         return [
//             {
//                 value: "1",
//                 label: "hello world yeah",
//                 role: "068e3829-c9cf-4c50-8d79-e6947a15fc29"
//             },
//             {
//                 value: "2",
//                 label: "2",
//                 role: "068e3829-c9cf-4c50-8d79-e6947a15fc29"
//             }
//         ];
//     }

//     await new Promise((res, rej) => {
//         try {
//             setTimeout(res, 1000);
//         } catch (error) {
//             rej(error);
//         }
//     });
//     return [
//         {
//             value: "1",
//             label: "hello world yeah",
//             role: "068e3829-c9cf-4c50-8d79-e6947a15fc29"
//         },
//         {
//             value: "2",
//             label: "2",
//             role: "068e3829-c9cf-4c50-8d79-e6947a15fc29"
//         },
//         {
//             value: "3",
//             label: "3",
//             role: "1f105cde-4592-4e74-8e86-6c90beeb1e3a"
//         },
//         {
//             value: "4",
//             label: "4",
//             role: "1f105cde-4592-4e74-8e86-6c90beeb1e3a"
//         },
//         {
//             value: "5",
//             label: "5",
//             role: "5851b609-bef2-44a2-b11c-f2663fb0a041"
//         }
//     ];
// };

export const getRolesTemplate = async () => {
    try {
        const response = await privateGateway.get(
            dashboardRoutes.getRolesTemplate,
            { responseType: "blob" } // Set the response type to 'blob'
        );
        const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }); // Set the correct MIME type for XLSX files

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "RolesTemplate.xlsx");

        document.body.appendChild(link);
        link.click();
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};

// function to take a js object and convert it to a XLSX file using the SheetJS library
// bundle size increased from 106kb to 160kb, but dynamically imported

export const convertToXLSX = (data: any, fileName: string) => {
    import("xlsx")
        .then(({ utils, writeFile }) => {
            const ws = utils.json_to_sheet(data);
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, "Result 1");
            writeFile(wb, fileName);
        })
        .catch(err => console.error(err));
};
