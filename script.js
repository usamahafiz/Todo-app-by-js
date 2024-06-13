//show toast
const showNotification = (msg,type)=>{
    let bgColor;
    switch(type){
        case 'error':
        bgColor = "linear-gradient(to right, #93291e, #ed213a)";
         break;
        case 'success':
        bgColor = "linear-gradient(to right, #1D976C, #93F9B9)";
        break;
        default:
            bgColor = "fff";

    }

    Toastify({
        text: msg,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: bgColor
        },
        onClick: function () { } // Callback after click
    }).showToast();
}


const setTodosInLocalStorage = (newtodos) =>{
    localStorage.setItem('todos', JSON.stringify(newtodos));
}

const showOutput= (output)=>{
    document.getElementById("output").innerHTML=output;
}

const getFieldValue=(fieldId)=>{
    return document.getElementById(fieldId).value;
}

const setFieldValue=(fieldId,value)=>{
    document.getElementById(fieldId).value=value;
}

const getRandomId=()=>{
    return Math.random().toString(36).slice(2)
}
function clearOutput(){
    document.getElementById("output").innerHTML = "";
}

const emptyFieldValue=()=>{
    document.getElementById("title").value="";
    document.getElementById("location").value="";
    document.getElementById("description").value="";

}

const handleSubmit= ()=>{
    event.preventDefault();

    let title= getFieldValue("title"), location=getFieldValue("location"), description=getFieldValue("description");

    title= title.trim();
    location= location.trim();
    description= description.trim();

    if(title.length<3){
        showNotification("Please enter your title correctly","error");
        return;
    }

    if(location.length<3){
        showNotification("Please enter your location correctly","error");
        return;
    }

    if(description.length<10){
        showNotification("Please enter your description correctly","error");
        return;
    }

    let todo= {title,location,description}
    // console.log(todo)
    // return;

    todo.id=getRandomId();
    todo.dateCreated=new Date().getTime();
    todo.status="active";

    const todos= JSON.parse(localStorage.getItem("todos")) || [];

    todos.push(todo)
    localStorage.setItem("todos",JSON.stringify(todos))
    showNotification("A new todo has been added successfully","success")
    emptyFieldValue()
    showTodo()


}

function showTodo(){
    const todos= JSON.parse(localStorage.getItem("todos")) || [];
    if(!todos.length){
        // showNotification("There is not a single todo available","error")
        showOutput("<h4 class='text-center '>Hurray!No task available.Add a task button to add your task.</h4>")
        return;
    }

    let tableStartingCode= `<div class= "table-responsive"><table class="table">`
    let tableEndingCode= `</table></div>`
    let tableHead = `<thead><tr><th scope="col">#</th><th scope="col">Title</th><th scope="col">Location</th><th scope="col">Description</th><th scope="col">Actions</th></tr></thead>`

    let tableBody = ''
    for(let i=0;i<todos.length;i++){
       let todo= todos[i]

        tableBody += `<tr><th>${i+1}</th><td>${todo.title}</td><td>${todo.location}</td><td>${todo.description}</td><td><button class="btn btn-sm btn-info" data-value="${todo.id}" onclick="editTodo(event)">Edit</button><button class="btn btn-sm ms-lg-2 ms-0 mt-2 mt-md-0 btn-danger" data-value="${todo.id}" onclick="deleteTodo(event)">Delete</button></td></tr>`

    }
     
    let table = tableStartingCode + tableHead + "<tbody>" +tableBody+"</tbody>" + tableEndingCode
    showOutput(table)

}

//delete todo by delete button
const deleteTodo = (event) =>{
    const todoId = event.target.getAttribute("data-value");
   
    const todos = JSON.parse(localStorage.getItem("todos"))
    let todoAfetrDelete = todos.filter((todo) =>{
        return todo.id !== todoId
    })
    // console.log(todos)
    // console.log(todoAfetrDelete)
    // return

    localStorage.setItem("todos",JSON.stringify(todoAfetrDelete))
    showNotification("Todo has been deleted successfully","success")
    showTodo()
}

//edit task by edit button 
const editTodo = (event) =>{
    const todoId = event.target.getAttribute("data-value");

    const todos = JSON.parse(localStorage.getItem("todos"))
    let todo = todos.find((todo) =>{
        return todo.id === todoId
    })

    const {title,location,description,id,status,dateCreated} = todo

    console.log(todo)
    console.log(title,location,description,id,status,dateCreated)

    setFieldValue("title",title)
    setFieldValue("location",location)
    setFieldValue("description",description)

    localStorage.setItem("todoForEdit",JSON.stringify(todo))
     document.getElementById("btnAdd").style.display="none"
     document.getElementById("btnUpdate").style.display="block"


}

//update any task by update button 
const handleEdit = ()=>{
    const todoForEdit = JSON.parse(localStorage.getItem("todoForEdit"))
    // console.log(todoForEdit)

    let updatedTitle = getFieldValue("title")
    let updatedLocation = getFieldValue("location")
    let updatedDescription = getFieldValue("description")

    const updatedTodo={
        ...todoForEdit,
        title:updatedTitle,
        location:updatedLocation,
        description:updatedDescription
    };

    updatedTodo.dateModified = new Date().getTime();

    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const updatedTodos = todos.map (todo=>{
        if(todo.id === updatedTodo.id){
            return updatedTodo
        }
        return todo

    })

    localStorage.setItem("todos",JSON.stringify(updatedTodos))
    showNotification("Todo has been updated successfully ","success")
    emptyFieldValue();
    document.getElementById("btnAdd").style.display="block"
    document.getElementById("btnUpdate").style.display="none"
    showTodo()
}
