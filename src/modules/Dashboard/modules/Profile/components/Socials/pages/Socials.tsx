import React, { useEffect, useState, useRef } from "react";
import styles from "./Socials.module.css";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { getSocials, updateSocials } from "../services/api";
import LinkedIn from "../../../assets/svg/LinkedIn";
import Twitter from "../../../assets/svg/Twitter";
import Instagram from "../../../assets/svg/Instagram";
import Behance from "../../../assets/svg/Behance";
import Github from "../../../assets/svg/Github";
import Facebook from "../../../assets/svg/Facebook";
import Dribble from "../../../assets/svg/Dribble";
import StackOverflow from "../../../assets/svg/StackOverflow";
import Medium from "../../../assets/svg/Medium";
import HackerRank from "../../../assets/svg/HackerRank";

type Props = {};

const Socials = (props: Props) => {
    const [socials, setSocials] = useState([]);
    const { id } = useParams<{ id: string }>();
    const [editSocials, setEditSocials] = useState(false);

    const socialMediaUrlMappings: { [key: string]: string } = {
        github: "https://github.com/",
        facebook: "https://www.facebook.com/",
        instagram: "https://www.instagram.com/",
        linkedin: "https://www.linkedin.com/in/",
        dribble: "https://dribbble.com/",
        behance: "https://www.behance.net/",
        stackoverflow: "https://stackoverflow.com/users/",
        medium: "https://medium.com/@",
        hackerrank: "https://www.hackerrank.com/profile/"
    };
    const socialMediaSvgComponents: { [key: string]: JSX.Element | null } = {
        github: <Github />,
        linkedin: <LinkedIn />,
        twitter: <Twitter />,
        instagram: <Instagram />,
        behance: <Behance />,
        facebook: <Facebook />,
        dribble: <Dribble />,
        stackoverflow: <StackOverflow />,
        medium: <Medium />,
        hackerrank: <HackerRank />
    };
    const formik = useFormik({
        initialValues: {
            github: "",
            facebook: "",
            instagram: "",
            linkedin: "",
            dribble: "",
            behance: "",
            stackoverflow: "",
            medium: "",
            hackerrank: ""
        },
        onSubmit: values => {
            updateSocials(values, setSocials, formikRef);
        },
        validate: (values: { [key: string]: string }) => {
            let errors: { [key: string]: string } = {};
            Object.entries(values).forEach(([key, value]) => {
                if (value && !value.match(/^[a-zA-Z0-9-_/.]+$/)) {
                    errors[key] = "Invalid username";
                }
            });
            return errors;
        }
    });

    const formikRef = useRef(formik);

    useEffect(() => {
        if (id) {
            getSocials(setSocials, formikRef, id);
        } else {
            getSocials(setSocials, formikRef);
        }

        // console.log(formik.values);
    }, []);

    return (
        <>
            <div className={styles.edit_social_btn}>
                <h2>Connect with me</h2>
                {!editSocials && !id && (
                    <p
                        onClick={() => setEditSocials(true)}
                        className={styles.edit_profile_btn}
                        tabIndex={0}
                    >
                        <i className="fi fi-rr-pencil"></i>
                    </p>
                )}
                {editSocials && !id && (
                    <p
                        onClick={() => {
                            Object.keys(formik.errors).length === 0 && (
                                <>
                                    {setEditSocials(false)}
                                    {formik.handleSubmit()}
                                </>
                            );
                        }}
                        className={styles.edit_profile_btn}
                        tabIndex={0}
                    >
                        <i className="fi fi-br-check"></i>
                    </p>
                )}
            </div>
            {Object.values(formik.values).filter(
                value => value === "" || value === null
            ).length >= 9 &&
                !editSocials && (
                    <p className={styles.display_message}>
                        You have not connected any socials medias to your
                        profile yet.
                    </p>
                )}
            <p className={styles.socials_icons}>
                {Object.values(formik.values).filter(
                    value => value === "" || value === null
                ).length <= 9
                    ? Object.entries(formik.values).map(
                          ([name, username], i) => {
                              if (editSocials ? true : username) {
                                  const urlPattern =
                                      socialMediaUrlMappings[name];
                                  const url = urlPattern + username;
                                  return (
                                      <>
                                          <div
                                              style={
                                                  editSocials
                                                      ? { width: "100%" }
                                                      : {}
                                              }
                                              className={styles.icon_and_input}
                                              key={i}
                                          >
                                              {" "}
                                              <a
                                                  key={name}
                                                  href={url}
                                                  target="_blank"
                                                  rel="noreferrer"
                                              >
                                                  {
                                                      socialMediaSvgComponents[
                                                          name
                                                      ]
                                                  }
                                              </a>
                                              {editSocials && !id && (
                                                  <input
                                                      type="text"
                                                      name={name}
                                                      placeholder={
                                                          name + " username"
                                                      }
                                                      value={
                                                          formik.values[
                                                              name as keyof typeof formik.values
                                                          ]
                                                      }
                                                      onChange={
                                                          formik.handleChange
                                                      }
                                                      onBlur={formik.handleBlur}
                                                  />
                                              )}
                                          </div>
                                          {formik.values[
                                              name as keyof typeof formik.values
                                          ] &&
                                              formik.errors[
                                                  name as keyof typeof formik.errors
                                              ] && (
                                                  <p
                                                      className={
                                                          styles.error_message
                                                      }
                                                      key={i}
                                                  >
                                                      {
                                                          formik.errors[
                                                              name as keyof typeof formik.errors
                                                          ]
                                                      }
                                                  </p>
                                              )}
                                      </>
                                  );
                              }
                              return ""; // if username is empty
                          }
                      )
                    : "No socials connected yet"}
            </p>
        </>
    );
};

export default Socials;
