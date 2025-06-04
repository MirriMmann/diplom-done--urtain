import React, { useEffect, useState } from "react";
import axios from "axios";

const UseTable = () => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error.response ? error.response.data : error.message);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setRole(user.role);
    setShowEditModal(true);
  };

  const handleSaveRole = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${selectedUser._id}/role`,
        { role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, role } : user
        )
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Ошибка при обновлении роли:", error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${selectedUser._id}`, {
      headers: { Authorization: `Bearer ${token}` },
      });      
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="user-table-container">
      <h2>Все пользователи</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEditClick(user)}>Редактировать</button>
                <button onClick={() => handleDeleteClick(user)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Изменить роль пользователя</h3>
            <label>Выберите роль:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
              <option value="creator">Создатель</option>
            </select>
            <div className="modal-buttons">
              <button onClick={handleSaveRole}>Сохранить</button>
              <button onClick={() => setShowEditModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Вы уверены, что хотите удалить этого пользователя?</h3>
            <div className="modal-buttons">
              <button onClick={handleConfirmDelete}>Да</button>
              <button onClick={() => setShowDeleteModal(false)}>Нет</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UseTable;
