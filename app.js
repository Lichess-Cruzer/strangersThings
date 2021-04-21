const BASE_URL = "https://strangers-things.herokuapp.com"
const className = "2102-CPU-RM-WEB-PT"


//Module 1 (Fetch Posts) -------------------------------------------------

function fetchPosts() {
    return fetch(`${ BASE_URL }/api/${ className }/posts`)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            // return data
            // console.log(data)
            return data.data.posts
        })
        .catch(function(error) {
            console.log(error)
        })
}

function renderPosts(posts) {
    // console.log(posts) // Posts that have been saved to the database
    posts.forEach(function(post) {
        // console.log(post)
        const postElement = createPostHTML(post)
        $('#posts').append(postElement)
    })
} 

function createPostHTML(post) {
    
    return     `
    <div class="accordion" id="accordionExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        ${post.title}
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body">
        ${post.author.username}
        <br>
        <br>
        <p>${post.description}</p>
        <strong>${post.price}</strong>
        <br>
        ${post.willDeliver}
        <br>
        <br>
            <button type="button" id="editBtn" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                Edit Button
            </button>
        </div>
      </div>
    </div>
    `
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

        hideLogin()

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
        console.log("there is nothing to hide")
    }
};

const hideLogin = () => {
    const token = localStorage.getItem("token");
    if (token){
        $(".login").css("display", "none")
    } else {
        console.log("there is nothing to hide")
    }
};

//Module 3 (Blog Posts)-------------------------------------------------

const fetchToken = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    return token ? token : console.log("Please Register or Log in");
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

//Module 4 (Modal CLicks and fetchMe)-------------------------------------------------

$(posts).on("click", "#editBtn", () => {

    $("#exampleModal").modal('show');
    $("#exampleModal .modal-body").empty()

    $("#exampleModal .modal-title").append("Edit Post")
    $("#exampleModal .modal-body").append("I need help editting this body!!!")

    $("button").on("click", () => {
        $("#exampleModal").modal('hide')
    })
})

const fetchMe = async() => {

    const token = fetchToken();
    const url = `${ BASE_URL }/api/${ className }/users/me`;

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${ token }`
                },
                body: JSON.stringify(),
            })

            const data = await response.json()
            console.log(data.data)
            return data.data;
            

        } catch(e) {
            console.error(e);
        } 
    }

    // ${ me._id === post.author._id ?
    //     `<button type="button" id="editBtn" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
    //         Edit Button
    //     </button>`: ''}

//Main Call Functions-------------------------------------------------
fetchPosts()
    .then(function(posts) {
        renderPosts(posts) //Renders the posts to the page
    })

fetchMe()
hideRegistration()
hideLogin()






