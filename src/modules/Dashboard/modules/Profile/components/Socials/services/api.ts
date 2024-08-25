import { privateGateway } from "@/MuLearnServices/apiGateways";
import { dashboardRoutes } from "@/MuLearnServices/urls";

type setSocials = UseStateFunc<any>;

export const getSocials = (setSocials: any, formikRef: any, id?: string) => {
    if (!id) id = "";
    if (id && id.length > 0) id = id + "/";
    privateGateway
        .get(dashboardRoutes.getSocials + id)
        .then(response => {
            const socialsData = response.data.response;
            setSocials(socialsData);
            // console.log(socialsData);

            formikRef.current.setValues(socialsData);
        })
        .catch(error => {
            console.log(error);
        });
};

export const updateSocials = (
    socials: any,
    setSocials: any,
    formikRef: any
) => {
    privateGateway
        .put(dashboardRoutes.getSocials + "edit/", socials)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
};
