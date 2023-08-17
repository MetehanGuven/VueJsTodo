import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    todoItems: [],
  },
  mutations: {
    setTodoItems(state, items) {
      state.todoItems = items;
    },
    addTodoItem(state, item) {
      state.todoItems.push(item);
    },
    removeTodoItem(state, itemId) {
      state.todoItems = state.todoItems.filter((item) => item.id !== itemId);
    },
    clearTodoItems(state) {
      state.todoItems = [];
    },
  },
  actions: {
    async loadTodoItems(context, userId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/Todos?userId=${userId}`
        );
        context.commit("setTodoItems", response.data);
        localStorage.setItem(`todos-${userId}`, JSON.stringify(response.data)); // localStorage'ı güncelle
      } catch (error) {
        console.error("Todo yüklenirken hata oluştu:", error);
      }
    },
    async addTodoItem(context, { userId, item }) {
      try {
        const response = await axios.post(`http://localhost:3000/Todos`, {
          userId,
          name: item.title,
        });
        context.commit("addTodoItem", response.data);
        // localStorage'ı güncelle
        const storedItems =
          JSON.parse(localStorage.getItem(`todos-${userId}`)) || [];
        localStorage.setItem(
          `todos-${userId}`,
          JSON.stringify([...storedItems, response.data])
        );
      } catch (error) {
        console.error("Todo eklenirken hata oluştu:", error);
      }
    },
    async removeTodoItem(context, { userId, itemId }) {
      try {
        await axios.delete(`http://localhost:3000/Todos/${itemId}`);
        context.commit("removeTodoItem", itemId);
        // localStorage'ı güncelle
        const storedItems =
          JSON.parse(localStorage.getItem(`todos-${userId}`)) || [];
        localStorage.setItem(
          `todos-${userId}`,
          JSON.stringify(storedItems.filter((item) => item.id !== itemId))
        );
      } catch (error) {
        console.error("Todo silinirken hata oluştu:", error);
      }
    },
    async updateTodoItem(context, { userId, item }) {
      try {
        await axios.put(`http://localhost:3000/Todos/${item.id}`, {
          userId,
          name: item.title,
        });
        const updatedItem = { ...item };
        context.commit("removeTodoItem", item.id);
        context.commit("addTodoItem", updatedItem);
        // localStorage'ı güncelle
        const storedItems =
          JSON.parse(localStorage.getItem(`todos-${userId}`)) || [];
        localStorage.setItem(
          `todos-${userId}`,
          JSON.stringify(
            storedItems.map((i) => (i.id === updatedItem.id ? updatedItem : i))
          )
        );
      } catch (error) {
        console.error("Todo güncellenirken hata oluştu:", error);
      }
    },
    clearTodoItems(context, userId) {
      context.commit("clearTodoItems");
      localStorage.removeItem(`todos-${userId}`);
    },
  },
  getters: {
    // Gerekirse getters tanımlayabilirsiniz
  },
});
