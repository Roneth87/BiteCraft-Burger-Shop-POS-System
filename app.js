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


// Change Quantity

function changeQuantity(id, amount){

    let item = cart.find(p => p.id === id);

     if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }
    displayCart();
}


// Clear Cart

function clearCart() {

    cart = [];
    displayCart();

}



// Place Order

function placeOrder() {

    let customer = document.getElementById("customerName").value.trim();

    if(customer === ""){
        alert("🔴Please enter customer name..🔴");
        return;
    }

    if (cart.length ===0){

        alert("🔴Please add products...🔴");
        return;
    }

    let total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;}, 0);


    let order ={

        id: Date.now(),
        customer: customer,

        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),

        total: total,
        date: new Date().toLocaleDateString()

    };


    orders.push(order);

    customers.push({
        id: Date.now(),
        name: customer,
        phone: "Not Provided"
    });

    saveData();

    alert("Order Placed Successfully..👍");

    cart = [];

    document.getElementById("customerName").value = "";
    displayCart();

}


// Start

displayProducts();
displayCart();



//------------CRUD Operations------------------------

// Product Management

function displayProductsTable() {

    let table = document.getElementById("productTable");

    if (!table) return;

    table.innerHTML = "";

    products.forEach(product => {
        table.innerHTML += `

            <tr>

                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>Rs. ${product.price}</td>

                <td>

                    <button onclick="editProduct(${product.id})">Edit</button>
                    <button onclick="deleteProduct(${product.id})">Delete</button>

                </td>

            </tr>
        `;
    });
}


// Add Product

function addProduct(){

    let name = document.getElementById("productName").value.trim();
    let price = Number(document.getElementById("productPrice").value);
    let category = document.getElementById("productCategory").value;

    if (name === "" || price <= 0){

        alert("⚠️Enter valid product details!");
        return;

    }

    products.push({

        id: Date.now(),
        name: name,
        price: price,
        category: category
    });

    saveData();
    displayProductsTable();

    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";

}


// Edit Product

function editProduct(id) {

    let product = products.find(p => p.id === id);
    let newName = prompt("Enter New Name", product.name);

    if (newName === null || newName.trim() === "") return;

    let newPrice = Number(prompt("Enter New Price", product.price));

    if (!Number.isFinite(newPrice) || newPrice <= 0) {

        alert("⚠️Invalid price!");
        return;

    }

    product.name = newName.trim();
    product.price = newPrice;

    saveData();
    displayProductsTable();

}


// Delete Product

function deleteProduct(id) {

    if (confirm("🗑️Delete this product?")) {

        products = products.filter(p => p.id !== id);

        saveData();
        displayProductsTable();

    }

}


// Customer Management

function displayCustomers() {

    let table = document.getElementById("customerTable");

    if (!table) return;
    table.innerHTML = "";

    customers.forEach(customer => {
        table.innerHTML += `

            <tr>

                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>

                <td>

                    <button onclick="editCustomer(${customer.id})">Edit</button>
                    <button onclick="deleteCustomer(${customer.id})">Delete</button>

                </td>

            </tr>
        `;
    });
}


// Add Customer

function addCustomer() {

    let name = document.getElementById("customerNameInput").value.trim();
    let phone = document.getElementById("customerPhone").value.trim();

    if (name === "" || phone === "") {

        alert("⚠️Enter customer details!");
        return;

    }

    customers.push({

        id: Date.now(),
        name: name,
        phone: phone
    });

    saveData();
    displayCustomers();

    document.getElementById("customerNameInput").value = "";
    document.getElementById("customerPhone").value = "";

}


// Edit Customer

function editCustomer(id) {

    let customer = customers.find(c => c.id === id);
    let name = prompt("Enter Customer Name", customer.name);

    if (name === null || name.trim() === "") return;

    let phone = prompt("Enter Phone Number", customer.phone);

    if (phone === null || phone.trim() === "") return;

    customer.name = name.trim();
    customer.phone = phone.trim();

    saveData();
    displayCustomers();

}


// Delete Customer

function deleteCustomer(id) {

    if (confirm("Delete Customer?")) {

        customers = customers.filter(c => c.id !== id);

        saveData();
        displayCustomers();

    }

}


// Order Management

function displayOrders() {

    let table = document.getElementById("orderTable");

    if (!table) return;

    table.innerHTML = "";

    orders.forEach(order => {

        let items = order.items.map(item =>
            `${item.name} x ${item.quantity}`
        ).join(", ");

        table.innerHTML += `

            <tr>

                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${items}</td>
                <td>Rs. ${order.total}</td>
                <td>${order.date}</td>

                <td>

                    <button onclick="deleteOrder(${order.id})">Delete</button>

                </td>

            </tr>
        `;
    });
}


// Delete Order

function deleteOrder(id) {

    if (confirm("Delete this order?")) {

        orders = orders.filter(o => o.id !== id);

        saveData();
        displayOrders();

    }

}


// Reports

function displayReports() {

    let revenue = orders.reduce((sum, order) => sum + order.total, 0);
    let revenueElement = document.getElementById("revenue");

    if (!revenueElement) return;

    revenueElement.innerText = "Rs. " + revenue;

    document.getElementById("reportOrders").innerText = orders.length;

    let table = document.getElementById("reportTable");

    table.innerHTML = "";

    orders.forEach(order => {
        table.innerHTML += `

            <tr>

                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>Rs. ${order.total}</td>
                <td>${order.date}</td>

            </tr>
        `;
    });
}




displayProductsTable();
displayCustomers();
displayOrders();
displayReports();

