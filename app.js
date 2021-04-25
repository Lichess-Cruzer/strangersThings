const BASE_URL = "https://strangers-things.herokuapp.com"
const className = "2102-CPU-RM-WEB-PT"


//Module 1 (Fetch Posts) -------------------------------------------------

function fetchPosts() {
    return fetch(`${ BASE_URL }/api/${ className }/posts`)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            return data.data.posts
        })
        .catch(function(error) {
            console.log(error)
        })
}

function renderPosts(posts, me) {
    posts.forEach(function(post) {
        const postElement = createPostHTML(post, me)
        $('#posts').append(postElement)
    })
} 

function createPostHTML(post, me) {

    const { _id, title, author, description, price, willDeliver} = post;
    const author_id = author._id;
    const username = author.username;

    return     $(`
    <div class="accordion">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne_${_id}" aria-expanded="true" aria-controls="collapseOne">
        ${title}
        </button>
      </h2>
      <div id="collapseOne_${_id}" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body">
        ${username}
        <br>
        <br>
        <p>${description}</p>
        <strong>${price}</strong>
        <br>
        ${willDeliver}
        <br>
        <br>
                    <button type="button" id="messageBtn" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                        Message
                    </button>

                    ${ me._id === post.author._id ?
                    `<button type="button" id="editBtn" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                        Edit Post
                    </button>
                    <button type="button" id="deleteBtn" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                        Delete
                    </button>`: ''}
                </div>
            </div>
        </div>
    </div>
    `).data('post',post)
}



//Module 4 (fetchMe / editBlogEntry / deleteBlogEntry) -------------------------------------------------

const fetchMe = async() => {

    const token = fetchToken();
    const url = `${ BASE_URL }/api/${ className }/users/me`;

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${ token }`
                },
            })

            const data = await response.json()
            return data.data;
            

        } catch(e) {
            console.error(e);
        } 
    }

    const editBlogEntry = async (requestBody, postId) => {
        
        const token = fetchToken();
        const url = `${ BASE_URL }/api/${ className }/posts/${postId}`;

        try {
            const response = await fetch(url, {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ token }`
                },
                body: JSON.stringify(requestBody),
            })

            const data = await response.json()
            return data.data;

        } catch(e) {
            console.error(e)
        }
    }

    const deleteBlogEntry = async (postId) => {
        
        const token = fetchToken();
        const url = `${ BASE_URL }/api/${ className }/posts/${postId}`;

        try {
            const respond = await fetch(url, {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ token }`
                },
            })
        } catch(e) {
            console.error(e)
        }
    }

//Module 2 (Authenticate Users)-------------------------------------------------

const registerUser = async (usernameValue, passwordValue) => {
    const url = `${ BASE_URL }/api/${ className }/users/register`;
    try {
        const response = await fetch(url, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                user: {
                    username: usernameValue,
                    password: passwordValue
                }
            }),
        });
        const { data: {token} } = await response.json();
        localStorage.setItem("token", JSON.stringify(token))

        hideRegistration()
        hideLogin()
        fetchPosts()
        .then(function(posts) {
            fetchMe().then(function(me){
                renderPosts(posts, me)
            })
})

    } catch(error) {
        console.error(error);
    }

};

const loginUser = async (usernameValue, passwordValue) => {

    const url = `${ BASE_URL }/api/${ className }/users/login`;
    try {
        const response = await fetch(url, { 
            method: "POST",
            body: JSON.stringify({ 
                user: {
                    username: usernameValue,
                    password: passwordValue
                }
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const { data: {token} } = await response.json();
        localStorage.setItem("token", JSON.stringify(token))

        hideRegistration()
        hideLogin()
        fetchPosts()
            .then(function(posts) {
                fetchMe().then(function(me){
                    renderPosts(posts, me)
                })
    })

    } catch(error) {
        console.error(error);
    }  

};

$(".register form").on('submit', (event) => {
    event.preventDefault();
    const username = $("#registerInputUsername").val();
    const password = $("#registerInputPassword").val();

    registerUser(username, password)

});

$(".login form").on('submit', (event) => {
    event.preventDefault();
    const username = $("#loginInputUsername").val();
    const password = $("#loginInputPassword").val();

    loginUser(username, password)

});

const hideRegistration = () => {
    const token = localStorage.getItem("token");
    if (token){
        $(".register").css("display", "none")
    } else {
        console.log("Please Register to void out errors")
    }
};

const hideLogin = () => {
    const token = localStorage.getItem("token");
    if (token){
        $(".login").css("display", "none")
    } else {
        console.log("Please Login to void out errors")
    }
};

//logOut Functions-------------------------------------------------

const userLogout = () => {
    localStorage.removeItem("token");
  
    $(".register").show(); 
    $(".register").css("display", "none");
  };
  

  const showLogout = () => {
    const token = localStorage.getItem("token");
  
    if (token) {
      $(".login").show(); 
      $(".login").css("display", "none");
    }
  };

  $("#app").on("click", "#logoutBtn", () => {
    console.log("You are now Logged out. Please reload the page.");
    userLogout();
  });

//Module 3 (Blog Posts)-------------------------------------------------

const fetchToken = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    return token ? token : console.log("Please Register or Log in to receive token");
  };

const postBlogEntry = async(post) => {
    
    console.log(post)

    const token = fetchToken();
    const url = `${ BASE_URL }/api/${ className }/posts`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ token }`
                },
                body: JSON.stringify(post),
            })

            const newPost = await response.json()
            return newPost;

        } catch(e) {
            console.error(e);
        } 
    }
    
    $("form").on("submit", (e) => {
        e.preventDefault();
    
        const blogTitle = $('#blog-title').val();
        const blogDescription = $('#blog-description').val();
        const blogPrice = $('#blog-price').val();
        const blogLocation = $('#blog-location').val();
        const willDeliver = $('#blog-willDeliver').val();
    
        const postData = {
            post: {
                title: blogTitle,
                description: blogDescription,
                price: blogPrice,
                location: blogLocation,
                deliver: willDeliver
            }
    };
    
        postBlogEntry(postData)
        $("form").trigger('reset')

        
    });

//Message Functions-------------------------------------------------

const createMessageHTML = (message) => {
    const {
      content,
      fromUser: { username },
    } = message;
  
    return $(`<div class="message-card">
    <div class="message-body">
      ${username ? `<h3 class="message-title">${username}</h3>` : ""}
      ${content ? `<p>${content}</p>` : ""}
    </div>
  </div>`).data('messages');
  };

const messageSend = async (messages, postId) => {
    const {
      post: { _id },
    } = postId;
  
    const token = JSON.parse(localStorage.getItem("token"));
  
    try {
      const response = await fetch(`${ BASE_URL }/api/${ className }/posts/${_id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messages),
      });
      const result = await response.json();
      return result;
    } catch (e) {
      console.error(e);
    }
  };
  
  const renderMessages = ({ messages } = post) => {
    $(".message-card").empty();
  
    if (messages.length === 0)
      return $("#exampleModal .modal-body").append("<h5>No messages to Show</h5>");
  
    messages.forEach((message) => {
      const messageElement = createMessageHTML(message);
  
      $(".message-card").append(messageElement);
    });
  };

  $('#app').on("click", "#view-messageBtn", () => {
    
    // let messageData = messageElement;
    // let postMessages = messageData.data('messages')

    $("#close").hide()
    $("#saveChanges").html("Close")

    $("#exampleModal").modal('show');
    $("#exampleModal .modal-body").empty()

    renderMessages()

    $("#exampleModal .modal-title").text("My Messages")
    // $("#exampleModal .modal-body").append(postMessages)

    $("button").on("click", () => {
        $("#exampleModal").modal('hide')
    })
})


//Module 4 (Modals)-------------------------------------------------

// Message Button ---------------------
$(posts).on("click", "#messageBtn", () => {

    $("#saveChanges").html("Send Message")

    $("#exampleModal").modal('show');
    $("#exampleModal .modal-body").empty()

    $("#exampleModal .modal-title").text("Send Message")
    $("#exampleModal .modal-body").append(`
            <div class="container">
            <form id="message-body">
            <div class="mb-3">
                <label for="message-body" class="form-label">Message Description</label>
                <textarea id="blog-description" class="form-control"  rows="4" cols="50" required></textarea>
            </div>
            </form>
        </div>
    `)

    $("button").on("click", () => {
        $("#exampleModal").modal('hide')
    })

    $("button").on("click", "#saveChanges", () => {
        messageSend()
        $("#exampleModal").modal('hide')
    })

})


// Edit Button ---------------------
$(posts).on("click", "#editBtn", function(post) {

    
    $("#exampleModal").modal('show');
    $("#exampleModal .modal-body").empty()

    let postMaterial = $(this).closest('.accordion')
    console.log(postMaterial)
    let postData = postMaterial.data('post')
    console.log(postData)

    $("#exampleModal .modal-title").text("Edit Post")
    $("#exampleModal .modal-body").append(`
            <div class="container">
            <form id="post-form">
            <div class="mb-3 mt-4">
                <label for="blog-title" class="form-label">Blog Title</label>
                <input id="blog-title" class="form-control" type="text" value=${ postData.title } required>
            </div>
            <div class="mb-3">
                <label for="blog-description" class="form-label">Description</label>
                <textarea id="blog-description" class="form-control"  rows="4" cols="50" required>${ postData.description }</textarea>
            </div>
            <div class="mb-3">
                <label for="blog-price" class="form-label">Price</label>
                <input id="blog-price" class="form-control" type="text" value=${ postData.price } required>
            </div>
            <div class="mb-3">
                <label for="blog-location" class="form-label">Location</label>
                <input id="blog-location" class="form-control" type="text" value=${ postData.location } required>
            </div>
            <div class="mb-3" id="blog-willDeliver">
                <label for="blog-willDeliver" class="form-label">Deliver</label>
                <input type="radio" id="True" value=${ postData.willDeliver }>
                <label for="True">Yes</label>
                <input type="radio" id="False" value=${ postData.willDeliver }>
                <label for="False">No</label><br>
            </div>
            </form>
        </div>
    `)

    $("button").on("click", () => {
        $("#exampleModal").modal('hide')
    })
})

// Delete Button ---------------------
$('#posts').on("click", "#deleteBtn", function () {
    console.log('delete')
    console.log(this)
    let deletePost = $(this).closest('.accordion')
    console.log(deletePost)
    let postData = deletePost.data('post')
    console.log(postData)
    
    
    deleteBlogEntry(postData._id).then(function(){
        deletePost.remove()
    }).catch(alert)
    })



//Main Call Functions-------------------------------------------------
fetchPosts()
    .then(function(posts) {
        fetchMe().then(function(me){
            renderPosts(posts, me)
        })
    })


hideRegistration()
hideLogin()






