import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { IoMdTrash } from "react-icons/io";

function App() {
  const [records, setRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [editState, setEditState] = useState(-1);

  //CheckBox
  const [selectedRows, setSelectedRows] = useState([]);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const rows = records.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(records.length / recordsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

  function handleSearch(event) {
    let newData = filterRecords.filter((row) => {
      // console.log("searchhh", search);
      if (
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.email.toLowerCase().includes(search.toLowerCase()) ||
        row.role.toLowerCase().includes(search.toLowerCase()) ||
        row.id.toLowerCase().includes(search.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    });

    newData.length = 3;
    setRecords(newData);
  }
  const handleReset = () => {
    console.log("reset was calikced");
    const fetData = async () => {
      axios
        .get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        )
        .then((res) => {
          // console.log(res.data);
          setRecords(res.data);
          setFilterRecords(res.data);
        })
        .catch((error) => console.log(error));
    };
    fetData();
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allselect") {
      const checkedvalue = records.slice(11, 10).map((row) => {
        return { ...row, isChecked: checked };
      });
      setRecords(checkedvalue);
    } else {
      const checkedvalue = records.map((row) =>
        row.name === name ? { ...row, isChecked: checked } : row
      );
      setRecords(checkedvalue);
    }
  };
  const handleAllDelete = () => {
    const recordsAfterDelete = records.filter((row) => !row.isChecked);
    setRecords(recordsAfterDelete);
    console.log("was clicked");
  };

  useEffect(() => {
    const fetData = async () => {
      axios
        .get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        )
        .then((res) => {
          // console.log(res.data);
          setRecords(res.data);
          setFilterRecords(res.data);
        })
        .catch((error) => console.log(error));
    };
    fetData();
  }, []);

  return (
    <div className="App">
      <div>
        <input
          className="search"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "6px 10px" }}
        />
        <FaSearch className="search-icon" onClick={() => handleSearch()} />
        <input type="reset" className="reset-btn" onClick={handleReset} />
      </div>
      <button class="delete-all-btn" onClick={handleAllDelete}>
        <IoMdTrash style={{ justifyContent: "center", fontSize: "15px" }} />
      </button>
      <form onSubmit={handleUpdateSubmit}>
        <table>
          <thead>
            <th>
              <input
                type="checkbox"
                name="allselect"
                checked={!records.some((row) => row?.isChecked !== true)}
                onChange={handleCheckboxChange}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </thead>
          <tbody>
            {rows.map((row, i) =>
              editState === row.id ? (
                <EditUser row={row} records={records} setRecords={setRecords} />
              ) : (
                <tr
                  key={i}
                  style={{
                    backgroundColor: row.isChecked
                      ? "lightgray"
                      : "transparent",
                  }}
                >
                  <td>
                    {
                      <input
                        type="checkbox"
                        name={row.name}
                        checked={row?.isChecked || false}
                        onChange={handleCheckboxChange}
                      />
                    }
                  </td>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.role}</td>
                  <td>
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => handleEditUser(row.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      type="button"
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </form>
      <nav>
        <ul className="pagination">
          <li className="page-item">
            <a href="#" className="page-link" onClick={prePage}>
              Prev
            </a>
          </li>
          {numbers.map((n, i) => (
            <li
              className={`page-item ${currentPage === n ? "active" : ""}`}
              key={i}
            >
              <a
                href="#"
                className="page-link"
                onClick={() => changeCurrentPage(n)}
              >
                {n}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a href="#" className="page-link" onClick={nextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
  //Pgination Functions
  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCurrentPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== nPage) {
      setCurrentPage(currentPage + 1);
    }
  }
  // Handle Edit & Delete functions
  function handleUpdateSubmit(e) {
    e.preventDefault();
    setEditState(-1);
  }
  function handleEditUser(id) {
    setEditState(id);
  }
  function handleDelete(id) {
    const updatedRecords = records.filter((row) => id !== row.id);
    setRecords(updatedRecords);
  }
  function EditUser({ row, records, setRecords }) {
    function handleName(event) {
      const name = event.target.value;
      const updatedRecords = records.map((r) =>
        r.id === row.id ? { ...r, name: name } : r
      );
      setRecords(updatedRecords);
    }
    function handleEmail(event) {
      const email = event.target.value;
      const updatedRecords = records.map((r) =>
        r.id === row.id ? { ...r, email: email } : r
      );
      setRecords(updatedRecords);
    }
    function handleRole(event) {
      const role = event.target.value;
      const updatedRecords = records.map((r) =>
        r.id === row.id ? { ...r, role: role } : r
      );
      setRecords(updatedRecords);
    }
    return (
      <tr>
        <td>
          <input
            type="text"
            value={row.id}
            name="id"
            placeholder="Enter id"
            disabled
          />
        </td>
        <td>
          <input
            type="text"
            value={row.name}
            name="name"
            placeholder="Enter Name"
            onChange={handleName}
          />
        </td>
        <td>
          <input
            type="email"
            value={row.email}
            name="email"
            placeholder="Enter Email"
            onChange={handleEmail}
          />
        </td>
        <td>
          <input
            type="text"
            value={row.role}
            name="role"
            placeholder="Enter Role"
            onChange={handleRole}
          />
        </td>
        <td>
          <button type="submit">Update</button>
        </td>
      </tr>
    );
  }
}

export default App;
