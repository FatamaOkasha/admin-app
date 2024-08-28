import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import EditUser from "./EditUser";
import { FaSearch } from "react-icons/fa";
import { IoMdTrash } from "react-icons/io";

function Logic() {
  const [records, setRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [editState, setEditState] = useState(-1);
  const searchInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const rows = records.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(records.length / recordsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setRecords(res.data);
        setFilterRecords(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [editState]);

  function handleSearch() {
    if (search === "") {
      setRecords(filterRecords);
    } else {
      const newData = filterRecords
        .filter((row) => {
          return (
            row.name.toLowerCase().includes(search.toLowerCase()) ||
            row.email.toLowerCase().includes(search.toLowerCase()) ||
            row.role.toLowerCase().includes(search.toLowerCase()) ||
            row.id.toLowerCase().includes(search.toLowerCase())
          );
        })
        .slice(0, 4); 

      setRecords(newData);
    }
  }

  const handleReset = () => {
    setRecords(filterRecords);
    setSearch("");
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allselect") {
      const updatedRecords = rows.map((row) => ({
        ...row,
        isChecked: checked,
      }));
      const allRecordsUpdated = records.map((record) =>
        updatedRecords.find((row) => row.id === record.id) || record
      );
      setRecords(allRecordsUpdated);
    } else {
      const updatedRecords = records.map((row) =>
        row.name === name ? { ...row, isChecked: checked } : row
      );
      setRecords(updatedRecords);
    }
  };

  const handleAllDelete = () => {
    const recordsAfterDelete = records.filter((row) => !row.isChecked);
    setRecords(recordsAfterDelete);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setEditState(-1);
  };

  const handleEditUser = (id) => {
    setEditState(id);
  };

  const handleDelete = (id) => {
    const updatedRecords = records.filter((row) => id !== row.id);
    setRecords(updatedRecords);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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

  return (
    <div className="MainComponent">
      <div>
        <input
          className="search"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyPress} 
          style={{ padding: "6px 10px" }}
          ref={searchInputRef}
        />
        <FaSearch className="search-icon" onClick={handleSearch} />
        <input type="reset" className="reset-btn" onClick={handleReset} />
      </div>
      <button className="delete-all-btn" onClick={handleAllDelete}>
        <IoMdTrash style={{ justifyContent: "center", fontSize: "15px" }} />
      </button>
      <form onSubmit={handleUpdateSubmit}>
        <table>
          <thead>
            <tr>
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
            </tr>
          </thead>
          <tbody>
            {rows.map((row) =>
              editState === row.id ? (
                <EditUser
                  key={row.id}
                  row={row}
                  records={records}
                  setRecords={setRecords}
                  setEditState={setEditState}
                />
              ) : (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: row.isChecked
                      ? "lightgray"
                      : "transparent",
                  }}
                >
                  <td>
                    <input
                      type="checkbox"
                      name={row.name}
                      checked={row?.isChecked || false}
                      onChange={handleCheckboxChange}
                    />
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
            <button
              className="page-link"
              onClick={prePage}
              disabled={currentPage === 1}
            >
              Prev
            </button>
          </li>
          {numbers.map((n) => (
            <li
              key={n}
              className={`page-item ${currentPage === n ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => changeCurrentPage(n)}
              >
                {n}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button
              className="page-link"
              onClick={nextPage}
              disabled={currentPage === nPage}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Logic;
