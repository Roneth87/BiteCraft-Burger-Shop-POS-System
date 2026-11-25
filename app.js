// Default Products

let products = JSON.parse(localStorage.getItem("products")) || [

    { id: 1, name: "Classic Burger", category: "Burger", price: 850 },
    { id: 2, name: "Cheese Burger", category: "Burger", price: 1000 },
    { id: 3, name: "Chicken Burger", category: "Burger", price: 1200 },
    { id: 4, name: "French Fries", category: "Fries", price: 450 },
    { id: 5, name: "Coca Cola", category: "Drinks", price: 250 },
    { id: 6, name: "Sprite", category: "Drinks", price: 250 }

];

// Default customers (no)

let customers = JSON.parse(localStorage.getItem("customers")) || [];

// Default orders (no)

let orders = JSON.parse(localStorage.getItem("orders")) || [];


// Save Data

function saveData() {

    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("orders", JSON.stringify(orders));

}


// Dashboard (total sales,orders,products,customers)

if (document.getElementById("totalSales")) {

    document.getElementById("totalSales").innerText = "Rs. " + orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById("totalOrders").innerText = orders.length;
    document.getElementById("totalProducts").innerText = products.length;
    document.getElementById("totalCustomers").innerText = customers.length;


    let recent = document.getElementById("recentOrders");

    orders.slice(-5).reverse().forEach(order => {

        recent.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>Rs. ${order.total}</td>
                <td>${order.date}</td>
            </tr>
        `;

    });

}


//-------products--------

let cart = [];


// Display Products

function displayProducts() {

    let menu = document.getElementById("menuProducts");

    menu.innerHTML = "";

    products.forEach(product => {

        menu.innerHTML += `

            <div class="menu-item">

                <h3>${product.name}</h3>
                <p>Rs. ${product.price}</p>
                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

            </div>

        `;

    });

}

// Add to Cart

function addToCart(id) {

    let product = products.find(p => p.id === id);
    let existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;

    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    displayCart();
}



// Display Cart

function displayCart() {

    let cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `

            <div class="cart-item">

                <p>${item.name}</p>

                <p>Rs. ${item.price} x ${item.quantity}</p>

                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>

            </div>

        `;

    });

    document.getElementById("total").innerText = total;

}

