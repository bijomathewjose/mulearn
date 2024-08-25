import { AxiosError } from "axios";
import { privateGateway, publicGateway } from "@/MuLearnServices/apiGateways";
import { dashboardRoutes, onboardingRoutes } from "@/MuLearnServices/urls";
import { NavigateFunction } from "react-router-dom";
import {
    TT,
    collegeOptions
} from "src/modules/Common/Authentication/services/onboardingApis";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
export const getManageUsers = async ({
    setData,
    page,
    selectedValue,
    setIsLoading,
    setTotalPages,
    search,
    sortID
}: {
    setData: UseStateFunc<any>;
    page: number;
    selectedValue: number;
    setIsLoading: UseStateFunc<boolean>;
    setTotalPages?: UseStateFunc<any>;
    search?: string;
    sortID?: string;
}) => {
    setIsLoading(true);
    try {
        const response = await privateGateway.get(
            dashboardRoutes.getUsersData,
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

        const datasuser = manageusers.response.data;
        for (let i = 0; i < datasuser.length; i++) {
            if (datasuser[i].college != null) {
            } else if (datasuser[i].company != null) {
                datasuser[i].college = datasuser[i].company;
            } else {
                //console.log(null);
            }
        }
        setData(datasuser);
        if (setTotalPages)
            setTotalPages(manageusers.response.pagination.totalPages);
        setIsLoading(false);
    } catch (err: unknown) {
        setIsLoading(false);
    }
};

export const createManageUsers = async (
    // firstName: string,
    // last_name: string,
    full_name: string,
    email: string,
    mobile: string,
    dob: string,
    gender: string
) => {
    try {
        const response = await privateGateway.post(
            dashboardRoutes.getUsersData,
            {
                // first_name: firstName,
                // last_name: last_name,
                full_name: full_name,
                email: email,
                mobile: mobile
            }
        );

        const message: any = response?.data;
        //console.log(message);
    } catch (err: unknown) {
        const error = err as AxiosError;
    }
};

export const editManageUsers = async (
    navigate: NavigateFunction,
    id?: string,
    // first_name?: string,
    // last_name?: string,
    full_name?: string,
    email?: string,
    mobile?: string,
    discord_id?: string | null,
    organizations?: string[],
    department?: string,
    graduation_year?: string,
    role?: string[],
    interest_groups?: string[]
) => {
    try {
        const response = await privateGateway.patch(
            dashboardRoutes.getUsersData + id + "/",
            {
                // first_name: first_name,
                // last_name: last_name,
                full_name: full_name,
                email: email,
                mobile: mobile,
                discord_id: discord_id,
                organizations: organizations,
                department: department,
                graduation_year: graduation_year,
                roles: role,
                interest_groups: interest_groups
            }
        );
        navigate("/dashboard/manage-users");
        //console.log(first_name, last_name, email);
        const message: any = response?.data;
        console.log(message);
        //console.log(message);

        toast.success("Updated SuccessFully");
    } catch (err: unknown) {
        const error = err as APIError;
        let errorMessage = "Some Error Occurred..";
        if (error?.response?.data?.message) {
            console.log(
                (
                    error?.response?.data?.message as {
                        code?: string[];
                        general?: string[];
                    }
                )?.general?.[0]
            );
        }

        if (error?.response) {
            toast.error(errorMessage);
        }
    }
};
export const getManageUsersDetails = async (id: string | undefined) => {
    try {
        const response = await privateGateway.get(
            dashboardRoutes.getUsersData + id + "/"
        );
        const message: any = response?.data;

        return message.response;
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};
/*
export const getAllOrganisations = async (
    toast: (options?: UseToastOptions | undefined) => ToastId
)=>{
    try{
        const data:orgSelectType = {College:[],Community:[],Company:[]}
        const routes = [
            organizationRoutes.getCollege,
            organizationRoutes.getCommunity,
            organizationRoutes.getCompany
        ]
        const response = await Promise.all(
            routes.map(route=>privateGateway.get(
                route,
                {params:
                    {
                        perPage:route===organizationRoutes.getCollege?2000:100//HardCode 2000
                    }
                }
            ))
        )
        const responseData = response.map(route=>
            route.data.response.data.map((obj:any)=>{
                //replacing id,title key with value,label
                return {value:obj.id,label:obj.title}
            })
            ) 
        data.College=responseData[0]
        data.Community=responseData[1]
        data.Company=responseData[2]
        
        return data

    }catch(err){
        console.log(err)
        
    }
}
*/
export const deleteManageUsers = async (id: string | undefined) => {
    try {
        const response = await privateGateway.delete(
            dashboardRoutes.getUsersData + id + "/"
        );

        toast.success("User deleted");
        const message: any = response?.data;
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            throw error;
        }
    }
};

// These are new apis
// Modify the getCommunities function to return a promise with community data
export const getCommunities = () => {
    return new Promise<any[]>((resolve, reject) => {
        publicGateway
            .get(onboardingRoutes.communityList)
            .then(response => {
                resolve(response.data.response.communities);
            })
            .catch((error: APIError) => {
                reject(error);
            });
    });
};

export const getRoles = () => {
    return new Promise<any[]>((resolve, reject) => {
        publicGateway
            .get(onboardingRoutes.roleList)
            .then(response => {
                resolve(response.data.response.roles);
            })
            .catch((error: APIError) => {
                reject(error);
            });
    });
};

export const getInterests = () => {
    return new Promise<any[]>((resolve, reject) => {
        publicGateway
            .get(onboardingRoutes.areaOfInterestList)
            .then(response => {
                resolve(
                    response.data.response.aois.map(
                        (roles: { name: any; id: any }) => ({
                            label: roles.name,
                            value: roles.id
                        })
                    )
                );
            })
            .catch((error: APIError) => {
                reject(error);
            });
    });
};

export const getCollegeOptions = async (
    setCollegeOptions: collegeOptions,
    setDepartmentAPI: collegeOptions,
    district: string
) => {
    try {
        const response: APIResponse<{ colleges: TT[]; departments: TT[] }> =
            await publicGateway.post(onboardingRoutes.collegeList, {
                district: district
            });

        const response2: APIResponse<{ schools: TT[] }> =
            await publicGateway.post(onboardingRoutes.schoolList, {
                district: district
            });

        const colleges = response.data.response.colleges;
        const schools = response2.data.response.schools;
        setCollegeOptions([
            ...colleges
                .sort((a, b) => a.title.localeCompare(b.title))
                .map(college => ({
                    value: college.id,
                    label: college.title
                })),
            ...schools
                .sort((a, b) => a.title.localeCompare(b.title))
                .map(school => ({
                    value: school.id,
                    label: school.title
                }))
        ]);
        setDepartmentAPI(
            response.data.response.departments.map(dept => ({
                value: dept.id,
                label: dept.title
            }))
        );
    } catch (error: any) {
        console.log(error);
        //errorHandler(error.response.status, error.response.data.status);
    }
};

export const editUsers = async (id: string, data: any) => {
    try {
        const response = await privateGateway.patch(
            dashboardRoutes.getUsersData + id + "/",
            data
        );
        const message: any = response?.data;
        return message;
    } catch (err: unknown) {
        const error = err as APIError;
        let errorMessage = "Some Error Occurred..";
        if (error?.response?.data?.message) {
            throw error;
        }
    }
};

export const getLocations = async (
    param: string,
    setLocationData: Dispatch<SetStateAction<any[]>>,
    setIsApiCalled: UseStateFunc<boolean>
) => {
    setIsApiCalled(true);
    await publicGateway
        .get(
            onboardingRoutes.location.replace(
                "${param}",
                param === "" ? "india" : param
            )
        )
        .then(response => {
            if (response.data.response.length === 0) {
                setIsApiCalled(false);
                setLocationData([{ id: "", location: "" }]);
                console.log("success");
            } else {
                setIsApiCalled(false);
                console.log(response.data.response);
                setLocationData(response.data.response);
            }
        })
        .catch((error: APIError) => {
            setIsApiCalled(false);
            console.log(error);
        });
};
