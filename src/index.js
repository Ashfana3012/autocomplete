const input = document.getElementById("autocomplete");
const suggestionsBox = document.getElementById("suggestions");
const productDetails = document.getElementById("product-details");

let timeoutId;

input.addEventListener("input", () => {
  const query = input.value.trim();
  clearTimeout(timeoutId);

  if (query.length < 2) {
    suggestionsBox.innerHTML = "";
    return;
  }

  timeoutId = setTimeout(() => {
    fetchData(query);
  }, 300);
});

async function fetchData(query) {
  try {
    const response = await fetch(
      `https://dummyjson.com/products/search?q=${query}`
    );
    const data = await response.json();

    // First 10 results
    const results = data.products.slice(0, 10);

    showSuggestions(results);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function showSuggestions(results) {
  suggestionsBox.innerHTML = "";

  if (results.length === 0) {
    suggestionsBox.innerHTML =
      "<div class='suggestion-item'>No results found</div>";
    return;
  }

  results.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("suggestion-item");
    div.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}" />
      <div class="info">
        <strong>${product.title}</strong>
        <p>${product.description.substring(0, 40)}...</p>
      </div>
    `;

    // When clicked → fetch full product details
    div.addEventListener("click", () => {
      input.value = product.title;
      suggestionsBox.innerHTML = "";
      fetchSingleProduct(product.id);
    });

    suggestionsBox.appendChild(div);
  });
}

async function fetchSingleProduct(id) {
  try {
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    const product = await response.json();
    let reviewsHtml = "";

    if (product.reviews) {
      product.reviews.forEach((reviews) => {
        reviewsHtml += ` <div class="review-box">
    <p><div class ="star">⭐${reviews.rating}</div> <strong class="reviewer">${reviews.reviewerName}</strong></P>
    <p class="comment"> ${reviews.comment}</p>
    </div>`;
      });
    } else {
      reviewsHtml = "<p>No reviews available</p>";
    }

    // Show full details
    productDetails.innerHTML = `
      <div class="product-card">
        <img src="${product.thumbnail}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <div class="stock">
        <p> ${product.availabilityStatus}</p>
        </div>
         <p><strong>Discount:</strong>-${product.discountPercentage}%</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Brand:</strong> ${product.brand}</p>
        <div class="rating">
        <p><strong>Rating:</strong> ${product.rating}⭐</p>
        </div>
        <p><strong>warranty:</strong> ${product.warrantyInformation}</p>
        <p><strong>shipping:</strong> ${product.shippingInformation}</p>
        <h4>Reviews:</h4>
        ${reviewsHtml}
      </div>`;
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}
