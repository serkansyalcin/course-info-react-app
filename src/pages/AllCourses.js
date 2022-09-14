import { filter } from "lodash";
import React from "react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import "../App.css";
import { MenuItem, ListItemIcon, ListItemText } from "@mui/material";

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import Page from "../Components/Page";
import Scrollbar from "../Components/Scrollbar";
import Iconify from "../Components/Iconify";
import SearchNotFound from "../Components/SearchNotFound";
import { UserListHead, UserListToolbar } from "../sections/@dashboard/user";
import api from "../helper/api";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 3,
  pb: 4,
};
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "title", label: "Title", alignRight: false },
  { id: "date", label: "Date", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "link", label: "Link", alignRight: false },
  // { id: "is_enrolled", label: "Erollment", alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.description.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function AllCourses() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(8);

  const [userList, setUserList] = useState([]);

  const getUsers = async () => {
    const data = await api("GET", "/wp-json/ldlms/v2/sfwd-courses", {});
    setUserList(data);
  };
  useEffect(() => {
    getUsers();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );

  const [open, setOpen] = React.useState(false);
  const [course, setCourse] = React.useState(null);
  const handleModalOpen = (course) => {
    setCourse(course);
    setOpen(true);
  };
  const handleModalClose = () => setOpen(false);

  const isUserNotFound = filteredUsers.length === 0;
  useEffect(() => {}, [filteredUsers]);

  return (
    <Page title="All Courses">
      <Container className="pt-3">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          mb={5}
        >
          <Typography variant="h2" align="center">
            All Courses
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 760 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredUsers.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, title, link, date, status } = row;
                      const isItemSelected = selected.indexOf(title) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={5}
                          sx={{
                            cursor: "pointer",
                          }}
                          // role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          onClick={(e) => {
                            const user = userList.filter(
                              (user) => user.id === id
                            );
                            console.log(user[0]);
                            handleModalOpen(user[0]);
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            padding="2"
                            fontSize="18px"
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              {/* <Avatar alt={title} src={card_image} /> */}
                              <Typography variant="subtitle2" noWrap>
                                {title.rendered}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{date}</TableCell>
                          <TableCell align="left">{status}</TableCell>
                          <TableCell align="left">{link}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {course && (
                  <Modal
                    open={open}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h4"
                        component="h2"
                        mt={2}
                      >
                        {course.title.rendered}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <b>Date: </b>
                        {course.date}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 2,
                          justifyContent: "space-between",
                          display: "flex",
                        }}
                      >
                        <p>
                          <b>Course Status: </b>
                          {course.status}
                        </p>
                      </Typography>

                      <Typography
                        sx={{
                          mt: 2,
                          justifyContent: "space-between",
                          display: "flex",
                        }}
                      >
                        <p>
                          <b> Link: </b>
                          <a href={course.link}> {course.link} </a>
                        </p>
                      </Typography>
                    </Box>
                  </Modal>
                )}

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
