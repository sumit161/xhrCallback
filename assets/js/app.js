let cl = console.log;
let baseUrl = `https://jsonplaceholder.typicode.com/posts`;
let postContainer = document.getElementById("postContainer")
let postform = document.getElementById("postform")
let titleControl = document.getElementById("title")
let contentcontrol = document.getElementById("content")
let submitBtn = document.getElementById("submitBtn")
let updateBtn = document.getElementById("updateBtn")

//===============makeapi function======================
function MakeapiCall(METHODNAME, APIURL, body) {
  let xhr = new XMLHttpRequest();
  xhr.open(METHODNAME, APIURL);
  xhr.onload = function () {
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.response);
      if (Array.isArray(data)) {

        templating(data)
      }

    } else if (xhr.status === 201) {
      body.id = JSON.parse(xhr.response).id;
      // cl(body)
      createcard(body)
    }
  }
  xhr.send()
}
MakeapiCall("GET", baseUrl, null)

//=============templating=====================
const templating = arr => {
  let result = "";
  arr.forEach(obj => {
    result += `
     <div class="card mb-4" id="${obj.id}">
               <div class="card-header">
                      <h3>${obj.title}</h3>
              </div>
              <div class="card-body">
                      <p>${obj.body}</p>
              </div>
               <div class="card-footer text-right">
                      <button class="btn btn-primary" onClick="onEdit(this)">Edit</button>
                      <button class="btn btn-danger" onClick="onDelete(this)">Delete</button>
               </div>
     </div>

            `
  });
  postContainer.innerHTML = result;
}

//==============================edit function===========================
function Edit(METHODNAME, APIURL, body) {
  let xhr = new XMLHttpRequest();
  xhr.open(METHODNAME, APIURL);
  xhr.onload = function () {
    let data = JSON.parse(xhr.response);
    // cl(data)
    titleControl.value = data.title,
      contentcontrol.value = data.body
    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none")
  };
  xhr.send(JSON.stringify(body))
}



//==========edit==================================
const onEdit = (ele) => {
  // cl(ele)
  let getEditid = ele.closest(".card").id;
  // cl(getEditid)
  localStorage.setItem("UpdateId", getEditid)
  let getobjUrl = `${baseUrl}/${getEditid}`
  // cl(getobjUrl);
  Edit("GET", getobjUrl, null)
}



//==========================createcard function=============
const createcard = obj => {
  let div = document.createElement("div");
  div.className = "card mb-4"
  div.setAttribute("data-id", obj.id);
  div.innerHTML = `
<div class="card-header">
           <h3>${obj.title}</h3>
</div>
<div class="card-body">
      <p>${obj.body}</p>
</div>
<div class="card-footer text-right">
         <button class="btn btn-primary" onClick="onEdit(this)">Edit</button>
         <button class="btn btn-danger" onClick="onDelete(this)">Delete</button>
</div>
        `
  postContainer.prepend(div)

}


//=================submit===================
const OnPostSubmit = eve => {
  // cl("submit")
  eve.preventDefault();
  let obj = {
    title: titleControl.value,
    body: contentcontrol.value,
    userId: Math.ceil(Math.random() * 10),
  }
  // cl(obj);
  postform.reset();
  MakeapiCall("POST", baseUrl, obj);

}


postform.addEventListener("submit", OnPostSubmit)

//============================update function==========
function update(METHODNAME, APIURL, body) {
  let xhr = new XMLHttpRequest();
  xhr.open(METHODNAME, APIURL);
  xhr.onload = function () {
    let getUpdatedid = localStorage.getItem("UpdateId");
    // cl(getUpdatedid);
    let card = document.querySelector(`[id = "${getUpdatedid}"]`);
    // cl(card)
    let child = [...card.children];
    // cl(child)
    child[0].innerHTML = body.title
    child[1].innerHTML = body.body
    submitBtn.classList.remove("d-none")
    updateBtn.classList.add("d-none")

  }
  xhr.send()
}

//====================OnpostUpdate============
const OnPostUpdate = () => {
  // cl("hhhhhhhhhhh")
  let getUpdatedid = localStorage.getItem("UpdateId");
  // cl(getUpdatedid);
  let Updateurl = `${baseUrl}/${getUpdatedid}`;
  // cl(Updateurl)
  let obj = {
    title: titleControl.value,
    body: contentcontrol.value,
  }
  update("PATCH", Updateurl, obj)
}



updateBtn.addEventListener("click", OnPostUpdate)
//======================================Delete============

const onDelete = (ele) => {
  // cl("deleted")
  let deletId = ele.closest(".card").id;
  // cl(deletId);
  let deleteUrl = `${baseUrl}/${deletId}`;
  MakeapiCall("DELETE", deleteUrl, null);
  ele.closest(".card").remove()

}



