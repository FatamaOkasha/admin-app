import React, { useState, useEffect, useRef } from "react";

function EditUser({ row, records, setRecords, setEditState }) {
  const [editField, setEditField] = useState(null);
  const [tempRecord, setTempRecord] = useState(row);

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const roleInputRef = useRef(null);

  useEffect(() => {
    switch (editField) {
      case "name":
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
        break;
      case "email":
        if (emailInputRef.current) {
          emailInputRef.current.focus();
        }
        break;
      case "role":
        if (roleInputRef.current) {
          roleInputRef.current.focus();
        }
        break;
      default:
        break;
    }
  }, [editField]);

  function handleChange(event) {
    const { name, value } = event.target;
    setTempRecord({ ...tempRecord, [name]: value });
  }

  function handleSave() {
    const updatedRecords = records.map((r) =>
      r.id === tempRecord.id ? { ...r, ...tempRecord } : r
    );
    setRecords(updatedRecords);
    setEditState(-1); 
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
        {editField === "name" ? (
          <input
            type="text"
            name="name"
            value={tempRecord.name}
            placeholder="Enter Name"
            onChange={handleChange}
            ref={nameInputRef}
          />
        ) : (
          <span onClick={() => setEditField("name")}>{row.name}</span>
        )}
      </td>
      <td>
        {editField === "email" ? (
          <input
            type="email"
            name="email"
            value={tempRecord.email}
            placeholder="Enter email"
            onChange={handleChange}
            ref={emailInputRef}
          />
        ) : (
          <span onClick={() => setEditField("email")}>{row.email}</span>
        )}
      </td>
      <td>
        {editField === "role" ? (
          <input
            type="text"
            name="role"
            value={tempRecord.role}
            placeholder="Enter role"
            onChange={handleChange}
            ref={roleInputRef}
          />
        ) : (
          <span onClick={() => setEditField("role")}>{row.role}</span>
        )}
      </td>
      <td>
        {editField ? (
          <button className="update-btn" type="button" onClick={handleSave}>
            Save
          </button>
        ) : null}
      </td>
    </tr>
  );
}

export default EditUser;
