import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-analytics.js";
import { getStorage, ref as stRef, uploadBytes } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { getDatabase, ref as dbRef, push, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js";

const firebaseConfig = {
apiKey: "AIzaSyBWnzzSV1uDRTqUTpmpxaYgPpVkjiq2DMM",
authDomain: "todoapp-c9030.firebaseapp.com",
projectId: "todoapp-c9030",
storageBucket: "todoapp-c9030.appspot.com",
messagingSenderId: "894388179036",
appId: "1:894388179036:web:4bb69a1d276228c1fe9699",
measurementId: "G-D49LVBRYGT"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);


Vue.component("todo-item", {
    template: '\
    <li>\
    {{ title }}\
    <div>\
        <button v-on:click="$emit(\'donetask\')"><i class="far fa-circle"></i></i></button>\
        <button v-on:click="$emit(\'remove\')"><i class="fas fa-times"></i></button>\
    </div>\
    </li>\
',
    props: ["title"],
});

const todosRef = dbRef(database, 'todos/');
var dataTodos = [];
onValue(todosRef, (snapshot) => {   
    // dataTodos = [];
    const data = snapshot.val();
    if (data != null) {        
        for (const [key, value] of Object.entries(data)) {
            dataTodos.push(value)
        } 
    }
    console.log(dataTodos)
});
var vueApp = new Vue({
    el: "#todo-list",
    data: {
        newTodoText: "",
        todos: dataTodos,
    },
    methods: {
        addNewTodo: function () {
            var uid =  Date.now().toString(36) + Math.random().toString(36).substr(2);
            this.todos.push({
                id: uid,
                title: this.newTodoText,
                status: false,
            });
            dataTodos = []
            set(dbRef(database, 'todos/' + uid), {
                id: uid,
                title: this.newTodoText,
                status: false,
            });
            uid = ""
            this.newTodoText = "";
        },
        donetask: function (id, title, status) {
            dataTodos = []
            update(dbRef(database, 'todos/' + id), {
                id: id,
                title: title,
                status: !status,
            });    
            this.todos = dataTodos
        },
        remove: function (id) {
            dataTodos = []
            remove(dbRef(database, 'todos/' + id))
            this.todos = dataTodos
        },
        doneall: function () {                     
            this.todos.forEach((item) => {                 
                if (!item.status) {
                    dataTodos = []
                    update(dbRef(database, 'todos/' + item.id), {
                    id: item.id,
                    title: item.title,
                    status: true,
                });
                }                          
            });
            this.todos = dataTodos            
        },
    },
});