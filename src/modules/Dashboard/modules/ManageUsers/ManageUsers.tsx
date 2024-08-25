import Pagination from "@/MuLearnComponents/Pagination/Pagination";
import THead from "@/MuLearnComponents/Table/THead";
import Table from "@/MuLearnComponents/Table/Table";
import TableTop from "@/MuLearnComponents/TableTop/TableTop";
import { dashboardRoutes } from "@/MuLearnServices/urls";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteManageUsers, getManageUsers } from "./apis";
import { Blank } from "@/MuLearnComponents/Table/Blank";
import MuModal from "@/MuLearnComponents/MuModal/MuModal";
import UserForm from "./UserForm";

function ManageRoles() {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [perPage, setPerPage] = useState(20);
    const [sort, setSort] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const firstFetch = useRef(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [id, setId] = useState("");
    const UserFormRef = useRef<any>(null); //! Use for modal and form button connectivity

    type ColOrderType = { isSortable: boolean; column: string; Label: string };

    const columnOrder: ColOrderType[] = [
        // { column: "first_name", Label: "First Name", isSortable: true },
        // { column: "last_name", Label: "Last Name", isSortable: true },
        { column: "full_name", Label: "Full Name", isSortable: true },
        { column: "karma", Label: "Total Karma", isSortable: true },
        { column: "muid", Label: "Mu ID", isSortable: true },
        { column: "email", Label: "Email", isSortable: true },
        { column: "mobile", Label: "Mobile", isSortable: true },
        { column: "discord_id", Label: "Discord ID", isSortable: true },
        { column: "level", Label: "Level", isSortable: true },
        { column: "created_at", Label: "Created On", isSortable: true }
    ];

    useEffect(() => {
        if (firstFetch.current) {
            getManageUsers({
                setData: setData,
                page: 1,
                selectedValue: perPage,
                setIsLoading: setIsLoading,
                setTotalPages: setTotalPages,
                search: "",
                sortID: ""
            });
        }
        firstFetch.current = false;
    }, []);

    const handleNextClick = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        getManageUsers({
            setData: setData,
            page: nextPage,
            selectedValue: perPage,
            setIsLoading: setIsLoading,
            setTotalPages: () => {},
            search: "",
            sortID: sort
        });
    };

    const handlePreviousClick = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        getManageUsers({
            setData: setData,
            page: prevPage,
            selectedValue: perPage,
            setIsLoading: setIsLoading,
            setTotalPages: () => {},
            search: "",
            sortID: sort
        });
    };

    const handleSearch = (search: string) => {
        setCurrentPage(1);
        getManageUsers({
            setData: setData,
            page: 1,
            selectedValue: perPage,
            setIsLoading: setIsLoading,
            setTotalPages: setTotalPages,
            search: search,
            sortID: ""
        });
    };

    const handleEdit = (id: string | number | boolean) => {
        setId(id as string);
        setIsModalOpen(true);
        // navigate(`/dashboard/manage-users/edit/${id}`);
    };

    const handleDelete = (id: string | undefined) => {
        deleteManageUsers(id);
        getManageUsers({
            setData: setData,
            page: 1,
            selectedValue: perPage,
            setIsLoading: setIsLoading,
            setTotalPages: setTotalPages,
            search: "",
            sortID: ""
        });
        navigate("/dashboard/manage-users");
    };

    const handlePerPageNumber = (selectedValue: number) => {
        setCurrentPage(1);
        setPerPage(selectedValue);
        getManageUsers({
            setData: setData,
            page: 1,
            selectedValue: selectedValue,
            setIsLoading: setIsLoading,
            setTotalPages: setTotalPages,
            search: "",
            sortID: ""
        });
    };

    const handleIconClick = (column: string) => {
        if (sort === column) {
            setSort(`-${column}`);
            getManageUsers({
                setData: setData,
                page: 1,
                selectedValue: perPage,
                setIsLoading: setIsLoading,
                setTotalPages: setTotalPages,
                search: "",
                sortID: `-${column}`
            });
        } else {
            setSort(column);
            getManageUsers({
                setData: setData,
                page: 1,
                selectedValue: perPage,
                setIsLoading: setIsLoading,
                setTotalPages: setTotalPages,
                search: "",
                sortID: column
            });
        }
    };

    return (
        <>
            {data && (
                <>
                    <TableTop
                        onSearchText={handleSearch}
                        onPerPageNumber={handlePerPageNumber}
                        CSV={dashboardRoutes.getUsersList}
                        // CSV={"http://localhost:8000/api/v1/dashboard/ig/csv"}
                    />
                    <MuModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title={`Edit User`}
                        type={"success"}
                        body={`Enter the details of the user.`}
                        onDone={() =>
                            UserFormRef.current?.handleSubmitExternally()
                        }
                    >
                        <UserForm
                            ref={UserFormRef}
                            id={id}
                            closeModal={() => setIsModalOpen(false)}
                        />
                    </MuModal>
                    <Table
                        rows={data}
                        isloading={isLoading}
                        page={currentPage}
                        perPage={perPage}
                        columnOrder={columnOrder}
                        id={["id"]}
                        onEditClick={handleEdit}
                        onDeleteClick={handleDelete}
                        modalDeleteHeading="Delete"
                        modalTypeContent="error"
                        modalDeleteContent="Are you sure you want to delete this user ?"
                    >
                        <THead
                            columnOrder={columnOrder}
                            onIconClick={handleIconClick}
                            action={true}
                        />
                        <div>
                            {!isLoading && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    margin="10px 0"
                                    handleNextClick={handleNextClick}
                                    handlePreviousClick={handlePreviousClick}
                                    onSearchText={handleSearch}
                                    onPerPageNumber={handlePerPageNumber}
                                    perPage={perPage}
                                    setPerPage={setPerPage}
                                />
                            )}
                        </div>
                        <Blank />
                    </Table>
                </>
            )}
        </>
    );
}

export default ManageRoles;
