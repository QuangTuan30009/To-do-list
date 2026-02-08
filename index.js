const API_URL = "https://6904b4b06b8dabde4964cbfa.mockapi.io/tasks";

const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");

document.addEventListener("DOMContentLoaded", getTodo);
addButton.addEventListener("click", addTodo);

// CÁCH CŨ
// function getodo(){
//     fetch(API_URL)
//     //Chuyển về dạng json
//     .then(response => response.json())
//     //in ra dữ liệu sau khi chuyển xong
//     .then(data => {
//         console.log(data);
//     })
//     //Xử lí lỗi
//     .catch(error => {
//         console.log(error);
//     })
// }

//CÁCH MỚI - GET Function
async function getTodo() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const ul = document.querySelector(".todo-list");
    // SỬA LỖI: Bỏ comment dòng này để tránh bị trùng lặp khi thêm mới
    ul.innerHTML = "";

    data.forEach(item => {
      const li = document.createElement("li");
      // console.log(item);
      const formatdate = new Date(item.createdAt);
      const formattedDateString = `${formatdate.toLocaleDateString()} - ${formatdate.toLocaleTimeString()}`;
      // console.log(formattedDateString);
      li.className = "todo-item";

      // SỬA LỖI:
      // 1. Sửa cú pháp onclick của updateTodo (xóa '}' thừa)
      // 2. Thêm onclick cho nút xóa (deleteTodo)
      li.innerHTML = `
        <div class="todo-content">
          <input type="checkbox">
          <div>
            <span>${item.name}</span>
            <div>Create date: ${formattedDateString}</div>
          </div>
        </div>
        <div class="todo-action">
          <button onclick="updateTodo(${item.id},'${item.name}')"> <i class="fa-solid fa-pen-to-square"></i></button>
          <button onclick="deleteTodo(${item.id})"><i class="fa-solid fa-trash"></i></button>
        </div>`;
      ul.appendChild(li);
    });

  } catch (error) {
    console.log("Lỗi rùi:" + error);
  }
}

// Post function
async function addTodo() {
  const inputData = todoInput.value.trim();

  // Cải tiến: Kiểm tra input rỗng
  if (inputData === "") {
    Swal.fire({
      title: "Lỗi",
      text: "Vui lòng nhập nội dung công việc!",
      icon: "error",
    });
    return; // Dừng hàm
  }

  const newTodo = {
    "createdAt": new Date().toISOString(),
    "name": inputData,
    "is_completed": false,
  }

  try {
    const response = await axios.post(API_URL, newTodo);
    todoInput.value = ""; // XÓA NỘI DUNG TRONG INPUT SAU KHI THÊM
    console.log(response);

    Swal.fire({
      title: "Success",
      text: "Thêm thành công!",
      icon: "success",
      draggable: true
    });
    
    getTodo(); // Tải lại danh sách

  } catch (error) {
    console.log("Lỗi rùi nè:" + error);
  }
}

// Put function: Update task
// SỬA LỖI: Thêm logic tải lại (getTodo) sau khi update thành công
function updateTodo(id, content) {
  Swal.fire({
    title: "Cập nhật công việc",
    input: "text",
    inputAttributes: {
      autocapitalize: "off"
    },
    inputValue: content,
    showCancelButton: true,
    confirmButtonText: "Cập nhật",
    showLoaderOnConfirm: true,
    preConfirm: async (inputData) => {
      try {
        // Gửi yêu cầu PUT
        await axios.put(`${API_URL}/${id}`, {
          name: inputData
        });
      } catch (error) {
        // Hiển thị lỗi nếu request thất bại
        Swal.showValidationMessage(`Request failed: ${error}`);
      }
    },
  }).then((result) => {
    // Chỉ chạy khi người dùng nhấn "Cập nhật" VÀ preConfirm thành công
    if (result.isConfirmed) {
      Swal.fire('Thành công!', 'Đã cập nhật công việc.', 'success');
      getTodo(); // Tải lại danh sách
    }
  });
}

// Delete function
async function deleteTodo(id) {
  // Thêm xác nhận trước khi xóa
  Swal.fire({
    title: "Bạn chắc chắn muốn xóa?",
    text: "Hành động này không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Vâng, xóa nó!",
    cancelButtonText: "Hủy bỏ"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // Gửi yêu cầu DELETE
        await axios.delete(`${API_URL}/${id}`);
        
        Swal.fire(
          'Đã xóa!',
          'Công việc của bạn đã được xóa.',
          'success'
        );
        
        getTodo();
      } catch (error) {
        console.log("Lỗi khi xóa: " + error);
        Swal.fire(
          'Lỗi!',
          'Không thể xóa công việc.',
          'error'
        );
      }
    }
  });
}

