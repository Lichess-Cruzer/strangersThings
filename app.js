const BASE_URL = "https://strangers-things.herokuapp.com"
const className = "2102-CPU-RM-WEB-PT"

function fetchPosts() {
    return fetch(`${ BASE_URL }/api/${ className }/posts`)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            // return data
            console.log(data)
            return data.data.posts
        })
        .catch(function(error) {
            console.log(error)
        })
}

function renderPosts(posts) {
    // console.log(posts) // Posts that have been saved to the database
    posts.forEach(function(post) {
        console.log(post)
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
        ${post.description}
        </div>
      </div>
    </div>
    `
}

fetchPosts()
    .then(function(posts) {
        renderPosts(posts) //Renders the posts to the page
    })



// `
//     <div class="card" style="width: 18rem;">
//             <div class="card-body">
//                 <h5 class="card-title">${post.title}</h5>
//                 <p class="card-text">${post.description}</p>
//             <a href="#" class="btn btn-primary">Go somewhere</a>
//         </div>
//   </div>`