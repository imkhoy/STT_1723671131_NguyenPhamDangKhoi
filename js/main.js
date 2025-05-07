$(document).ready(function() {

    const path = window.location.pathname;
    if (path.includes("products.html")) showProducts();
    if (path.includes("product-detail.html")) showProductDetail();
    if (path.includes("cart.html")) renderCart();
    if (path.includes("news.html")) renderNewsList();
    if (path.includes("news-detail.html")) renderNewsDetail();
    if (path.includes("confirmation.html")) {
        const orderInfo = JSON.parse(localStorage.getItem("order"));
        if (orderInfo) {
            document.querySelector(".confirmation-message").innerHTML = `
          <h2>Đơn hàng của bạn đã được xác nhận!</h2>
          <p>Cảm ơn bạn đã mua hàng tại website Thiết bị mạng.</p>
          <p><strong>Họ tên:</strong> ${orderInfo.name}</p>
          <p><strong>Địa chỉ:</strong> ${orderInfo.address}</p>
          <p><strong>Điện thoại:</strong> ${orderInfo.phone}</p>
          <p><strong>Phương thức thanh toán:</strong> ${orderInfo.paymentMethod}</p>
          <a href="index.html" class="btn btn-primary mt-3">Quay lại trang chủ</a>
        `;
        }
    }

    $("#checkoutForm").submit(function(e) {
        e.preventDefault();
        const name = $("#name").val();
        const address = $("#address").val();
        const phone = $("#phone").val();
        const paymentMethod = $("#payment").val();

        if (!name || !address || !phone) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const orderInfo = { name, address, phone, paymentMethod };
        localStorage.setItem("order", JSON.stringify(orderInfo));

        localStorage.removeItem("cart");

        alert("Đơn hàng của bạn đã được xác nhận!");
        window.location.href = "confirmation.html";
    });

    updateCartCount();
});


function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Đã thêm sản phẩm vào giỏ hàng!");

    if (window.location.pathname.includes("cart.html")) {
        renderCart();
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }
}

function renderCart() {
    const cartContainer = document.getElementById("cartItems");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
        return;
    }

    let html = `
      <table class="table table-bordered align-middle text-center">
          <thead class="table-secondary">
              <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                  <th>Hành động</th>
              </tr>
          </thead>
          <tbody>
  `;

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.quantity * item.price;
        total += itemTotal;
        html += `
          <tr>
              <td>
                  <img src="${item.image}" alt="${item.name}" width="50" class="me-2">
                  ${item.name}
              </td>
              <td style="width: 140px;">
                  <div class="input-group input-group-sm">
                      <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(${item.id}, ${item.quantity - 1})">-</button>
                      <input type="number" min="1" value="${item.quantity}" class="form-control text-center quantity-input" style="width: 50px;" onchange="changeQuantity(${item.id}, this.value)">
                      <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(${item.id}, ${item.quantity + 1})">+</button>
                  </div>
              </td>
              <td>${item.price.toLocaleString()} VND</td>
              <td>${itemTotal.toLocaleString()} VND</td>
              <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Xóa</button></td>
          </tr>
      `;
    });

    html += `
          <tr>
              <td colspan="3"><strong>Tổng cộng</strong></td>
              <td colspan="2"><strong>${total.toLocaleString()} VND</strong></td>
          </tr>
          </tbody>
      </table>
      <div class="d-flex justify-content-end gap-2 mt-3">
      <button class="btn btn-outline-danger" onclick="clearCart()">Xóa toàn bộ giỏ hàng</button>
      <a href="checkout.html" class="btn btn-success">Thanh toán</a>
      </div>
  `;

    cartContainer.innerHTML = html;
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function clearCart() {
    if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
        localStorage.removeItem("cart");
        updateCartCount();
        renderCart();
    }
}

function changeQuantity(productId, newQty) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    newQty = parseInt(newQty);

    if (newQty <= 0) {
        alert("Số lượng phải lớn hơn 0.");
        renderCart();
        return;
    }

    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
}

const newsList = [{
        id: 1,
        title: "Router Wi-Fi 7 chính thức ra mắt",
        content: `Chuẩn Wi-Fi 7 hứa hẹn tốc độ nhanh gấp 4 lần so với Wi-Fi 6, hỗ trợ nhiều thiết bị hơn và độ trễ thấp hơn đáng kể.
        Với băng thông rộng hơn và công nghệ truyền dữ liệu tiên tiến như Multi-Link Operation (MLO), Wi-Fi 7 mang đến trải nghiệm mượt mà khi chơi game, xem video 8K, và làm việc trực tuyến.
        Nhiều hãng lớn như TP-Link, Asus, và Netgear đã sẵn sàng ra mắt sản phẩm hỗ trợ chuẩn Wi-Fi 7 trong năm nay.`,
        image: "../img/news1.jpg"
    },
    {
        id: 2,
        title: "TP-Link giới thiệu switch PoE mới cho doanh nghiệp nhỏ",
        content: `Switch PoE mới của TP-Link cung cấp khả năng cấp nguồn qua Ethernet, giúp giảm thiểu dây điện và chi phí triển khai cho camera giám sát và access point.
        Sản phẩm hỗ trợ chuẩn IEEE 802.3af/at, quản lý web thông minh và bảo mật nâng cao.
        Với thiết kế kim loại bền bỉ, thiết bị phù hợp với các doanh nghiệp nhỏ và hộ gia đình nâng cao.`,
        image: "../img/news2.jpg"
    },
    {
        id: 3,
        title: "MikroTik ra mắt router hiệu năng cao giá rẻ",
        content: `Router mới của MikroTik gây ấn tượng với khả năng xử lý mạnh mẽ, hỗ trợ Wi-Fi băng tần kép, VLAN, VPN, QoS và tường lửa nâng cao.
        Thiết bị có giá dưới 2 triệu đồng nhưng lại có tính năng tương đương với các router tầm trung và cao cấp khác trên thị trường.
        Đây là lựa chọn đáng cân nhắc cho người dùng chuyên sâu và doanh nghiệp nhỏ.`,
        image: "../img/news3.jpg"
    },
    {
        id: 4,
        title: "Cisco nâng cấp dòng switch Catalyst",
        content: `Catalyst 9000 mới từ Cisco tích hợp trí tuệ nhân tạo và khả năng tự động hóa trong quản lý mạng.
        Thiết bị giúp phát hiện và ngăn chặn mối đe dọa bảo mật theo thời gian thực, tối ưu hóa hiệu suất hoạt động và dễ dàng mở rộng cho các doanh nghiệp lớn.
        Sản phẩm đã được triển khai thử nghiệm tại nhiều hệ thống ngân hàng và tổ chức tài chính.`,
        image: "../img/news4.jpg"
    },
    {
        id: 5,
        title: "Phát hiện lỗ hổng bảo mật nghiêm trọng trên router D-Link",
        content: `Một lỗ hổng zero-day trên nhiều dòng router D-Link cho phép tin tặc khai thác từ xa để kiểm soát thiết bị.
        Người dùng được khuyến cáo cập nhật firmware mới nhất hoặc thay thế bằng thiết bị bảo mật hơn.
        Vụ việc làm dấy lên lo ngại về an ninh mạng tại gia đình và văn phòng nhỏ.`,
        image: "../img/news5.jpg"
    },
    {
        id: 6,
        title: "Linksys công bố hệ thống mesh Wi-Fi 6E",
        content: `Linksys đã công bố dòng sản phẩm mesh Wi-Fi mới hỗ trợ Wi-Fi 6E – băng tần 6GHz giúp tăng băng thông và giảm nhiễu.
        Thiết bị có thể phủ sóng toàn bộ ngôi nhà với kết nối liền mạch, phù hợp cho các gia đình nhiều tầng hoặc nhà thông minh.
        Hệ thống quản lý bằng ứng dụng di động giúp người dùng dễ dàng theo dõi hiệu suất và thiết lập mạng.`,
        image: "../img/news6.jpg"
    },
    {
        id: 7,
        title: "Asus AX88U được đánh giá cao về tốc độ và độ ổn định",
        content: `Router Asus AX88U đã đạt kết quả vượt trội trong thử nghiệm với hơn 1Gbps khi truyền dữ liệu qua Wi-Fi trong môi trường có nhiều thiết bị kết nối.
        Sản phẩm cũng được trang bị công nghệ Adaptive QoS giúp tối ưu hóa băng thông khi chơi game và xem video trực tuyến.
        Đây là một trong những router được cộng đồng công nghệ đánh giá cao nhất hiện nay.`,
        image: "../img/news7.jpg"
    },
    {
        id: 8,
        title: "Các tiêu chuẩn mạng công nghiệp mới cho nhà máy thông minh",
        content: `IEEE đang phát triển các tiêu chuẩn Ethernet thời gian thực mới để phục vụ nhu cầu sản xuất tự động.
        Các chuẩn này sẽ giúp đảm bảo độ chính xác và độ trễ thấp trong quá trình truyền dữ liệu giữa các thiết bị điều khiển và máy móc công nghiệp.
        Việc ứng dụng rộng rãi sẽ mở ra tương lai cho các nhà máy vận hành hoàn toàn thông minh.`,
        image: "../img/news8.jpg"
    },
    {
        id: 9,
        title: "UniFi mở rộng giải pháp mạng Wi-Fi cho trường học",
        content: `UniFi đã ra mắt gói giải pháp mạng Wi-Fi toàn diện cho các cơ sở giáo dục, hỗ trợ cấu hình linh hoạt và bảo mật cao.
        Thiết bị có khả năng phân vùng mạng theo lớp học, giám sát và giới hạn băng thông phù hợp cho từng nhóm người dùng.
        Giải pháp này đã được triển khai tại nhiều trường học tại Mỹ và châu Âu.`,
        image: "../img/news9.jpg"
    },
    {
        id: 10,
        title: "So sánh router Wi-Fi 6 với Wi-Fi 7: Có nên nâng cấp?",
        content: `Wi-Fi 7 vượt trội với tốc độ gấp 4 lần, độ trễ thấp hơn, phù hợp với các ứng dụng yêu cầu cao như AR/VR và livestream 8K.
        Tuy nhiên, với nhu cầu phổ thông như lướt web, xem phim, học online, thì Wi-Fi 6 vẫn là lựa chọn hợp lý và tiết kiệm chi phí.
        Việc nâng cấp nên dựa trên thiết bị bạn đang sử dụng và mục đích chính của hệ thống mạng.`,
        image: "../img/news10.jpg"
    }
];

function renderNewsList() {
    const newsListContainer = document.getElementById("newsList");

    let html = '';
    newsList.forEach(news => {
        html += `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="${news.image}" class="card-img-top" alt="${news.title}">
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="news-detail.html?id=${news.id}" class="text-decoration-none text-dark">${news.title}</a>
                    </h5>
                    <p class="card-text">${news.content}</p>
                </div>
            </div>
        </div>
    `;
    });

    newsListContainer.innerHTML = html;
}

function renderNewsDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = parseInt(urlParams.get("id"));

    const news = newsList.find(n => n.id === newsId);

    if (news) {
        document.getElementById("detail-image").src = news.image;
        document.getElementById("detail-title").innerText = news.title;
        document.getElementById("detail-content").innerText = news.content;
    } else {
        document.getElementById("news-detail").innerHTML = "<p>Không tìm thấy bài viết.</p>";
    }
}

const products = [
    { id: 1, name: "Router TP-Link AX1800", image: "../img/router1.jpg", price: 1500000, desc: "WiFi 6 tốc độ cao, phù hợp gia đình", specs: "Tốc độ: 1800Mbps, Băng tần: 2.4GHz + 5GHz, Kết nối: 4 cổng Gigabit, Công nghệ WiFi 6" },
    { id: 2, name: "Switch Cisco 24 Port", image: "../img/switch1.jpg", price: 2800000, desc: "Thiết bị chuyển mạch doanh nghiệp", specs: "Ports: 24, Tiêu chuẩn: 10/100/1000Mbps, Quản lý: Không quản lý, Cấu trúc vỏ kim loại" },
    { id: 3, name: "Access Point UniFi U6", image: "../img/ap1.jpg", price: 2200000, desc: "Phủ sóng WiFi mạnh mẽ, ổn định", specs: "Tốc độ: 1800Mbps, Băng tần: 2.4GHz + 5GHz, Cổng Gigabit Ethernet, Công nghệ WiFi 6" },
    { id: 4, name: "Router ASUS RT-AX55", image: "../img/router2.jpg", price: 1700000, desc: "WiFi 6 chuẩn AX tốc độ cao cho gia đình", specs: "Tốc độ: 1800Mbps, Băng tần: 2.4GHz + 5GHz, Kết nối: 4 cổng Gigabit, Công nghệ bảo mật WPA3" },
    { id: 5, name: "Switch TP-Link 8 Port", image: "../img/switch2.jpg", price: 650000, desc: "Switch nhỏ gọn cho văn phòng mini", specs: "Ports: 8, Tiêu chuẩn: 10/100Mbps, Không quản lý, Cắm và sử dụng" },
    { id: 6, name: "Router Tenda AC10U", image: "../img/router3.jpg", price: 670000, desc: "Router băng tần kép, cổng USB hỗ trợ lưu trữ.", specs: "Tốc độ: 1200Mbps, Băng tần: 2.4GHz + 5GHz, 1 cổng USB 2.0, 4 cổng LAN Gigabit" },
    { id: 7, name: "Switch Cisco SF110D-08", image: "../img/switch3.jpg", price: 950000, desc: "Switch cao cấp 8 cổng, phù hợp văn phòng.", specs: "Ports: 8, Tiêu chuẩn: 10/100Mbps, Quản lý: Không quản lý, Cắm và sử dụng" },
    { id: 8, name: "Router Xiaomi 4A Gigabit", image: "../img/router4.jpg", price: 590000, desc: "Giá rẻ, hiệu năng tốt, WiFi AC1200.", specs: "Tốc độ: 1200Mbps, Băng tần: 2.4GHz + 5GHz, Kết nối: 4 cổng Gigabit" },
    { id: 9, name: "Switch Tenda S105", image: "../img/switch4.jpg", price: 210000, desc: "Switch mini 5 cổng, dùng cho hộ gia đình.", specs: "Ports: 5, Tiêu chuẩn: 10/100Mbps, Không quản lý, Thiết kế nhỏ gọn" },
    { id: 10, name: "Router Mercusys MW325R", image: "../img/router5.jpg", price: 390000, desc: "Router giá rẻ, vùng phủ sóng rộng.", specs: "Tốc độ: 1200Mbps, Băng tần: 2.4GHz + 5GHz, Kết nối: 4 cổng LAN" },
    { id: 11, name: "Switch Netgear GS308", image: "../img/switch5.jpg", price: 990000, desc: "Switch 8 cổng Gigabit, tốc độ cao.", specs: "Ports: 8, Tiêu chuẩn: Gigabit Ethernet, Quản lý: Không quản lý, Cắm và sử dụng" },
    { id: 12, name: "Router TP-Link Archer AX10", image: "../img/router6.jpg", price: 1250000, desc: "Router WiFi 6 AX1500 mới nhất.", specs: "Tốc độ: 1500Mbps, Băng tần: 2.4GHz + 5GHz, Kết nối: 4 cổng Gigabit, Công nghệ bảo mật WPA3" },
    { id: 13, name: "Switch Linksys LGS108", image: "../img/switch6.jpg", price: 1350000, desc: "Switch Gigabit không quản lý, 8 cổng.", specs: "Ports: 8, Tiêu chuẩn: Gigabit Ethernet, Quản lý: Không quản lý, Cắm và sử dụng" },
    { id: 14, name: "Router Huawei WS5200", image: "../img/router7.jpg", price: 770000, desc: "Router 4 ăng-ten, hỗ trợ IPv6.", specs: "Tốc độ: 1200Mbps, Băng tần: 2.4GHz + 5GHz, Kết nối: 4 cổng Gigabit" },
    { id: 15, name: "Switch TP-Link TL-SG1005D", image: "../img/switch7.jpg", price: 480000, desc: "Switch 5 cổng Gigabit, hiệu năng cao.", specs: "Ports: 5, Tiêu chuẩn: Gigabit Ethernet, Quản lý: Không quản lý" },
    { id: 16, name: "Router ASUS TUF Gaming AX3000", image: "../img/router8.jpg", price: 2550000, desc: "Router gaming mạnh mẽ, chuẩn WiFi 6.", specs: "Tốc độ: 3000Mbps, Băng tần: 2.4GHz + 5GHz, 4 cổng Gigabit, Công nghệ WiFi 6" },
    { id: 17, name: "Switch D-Link DES-1005A", image: "../img/switch8.jpg", price: 230000, desc: "Switch 5 cổng, tiết kiệm điện.", specs: "Ports: 5, Tiêu chuẩn: 10/100Mbps, Quản lý: Không quản lý, Tiết kiệm năng lượng" },
    { id: 18, name: "Router MikroTik hAP ac2", image: "../img/router9.jpg", price: 1150000, desc: "Router mạnh mẽ cho người dùng chuyên sâu.", specs: "Tốc độ: 1200Mbps, Băng tần: 2.4GHz + 5GHz, 5 cổng Gigabit Ethernet, 1 cổng USB 2.0" },
    { id: 19, name: "Switch Tenda S105", image: "../img/switch9.jpg", price: 210000, desc: "Switch mini 5 cổng, dùng cho hộ gia đình.", specs: "Ports: 5, Tiêu chuẩn: 10/100Mbps, Không quản lý, Thiết kế nhỏ gọn" },
    { id: 20, name: "Router Mercusys MW325R", image: "../img/router10.jpg", price: 390000, desc: "Router giá rẻ, vùng phủ sóng rộng.", specs: "Tốc độ: 1200Mbps, Băng tần: 2.4GHz + 5GHz, Kết nối: 4 cổng LAN" }
];
localStorage.setItem("products", JSON.stringify(products));

function showProducts() {
    const productList = document.getElementById("productList");
    const products = JSON.parse(localStorage.getItem("products")) || [];

    if (products.length === 0) {
        productList.innerHTML = "<p>Không có sản phẩm nào để hiển thị.</p>";
        return;
    }

    let html = "";
    products.forEach(product => {
        html += `
        <div class="product-item" onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.name}" width="200">
            <h3>${product.name}</h3>
            <p class="desc">${product.desc}</p>
            <p class="price">${product.price.toLocaleString()} VND</p>
            <button onclick="event.stopPropagation(); addToCart(${product.id})">Thêm vào giỏ hàng</button>
        </div>
        `;
    });

    productList.innerHTML = html;
}

function showProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => p.id === productId);

    if (product) {
        document.getElementById("detail-image").src = product.image;
        document.getElementById("detail-image").alt = product.name;
        document.getElementById("detail-name").textContent = product.name;
        document.getElementById("detail-desc").textContent = product.desc;
        document.getElementById("detail-price").textContent = product.price.toLocaleString() + " VND";
        const specsList = document.getElementById("detail-specs");
        if (product.specs) {
            const specs = product.specs.split(", ");
            specsList.innerHTML = specs.map(spec => `<li>${spec}</li>`).join('');
        } else {
            specsList.innerHTML = "<li>Không có thông tin</li>";
        }

        document.getElementById("add-to-cart").onclick = function() {
            addToCart(product.id);
        };
    } else {
        document.getElementById("product-detail").innerHTML = "<p class='text-danger'>Sản phẩm không tồn tại!</p>";
    }
}

$("#checkoutForm").submit(function(e) {
    e.preventDefault();
    const name = $("#name").val();
    const address = $("#address").val();
    const phone = $("#phone").val();
    const paymentMethod = $("#payment").val();

    if (!name || !address || !phone) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    const orderInfo = { name, address, phone, paymentMethod };
    localStorage.setItem("order", JSON.stringify(orderInfo));
    alert("Đơn hàng của bạn đã được xác nhận!");
    window.location.href = "confirmation.html";
});

$('#registerForm').on('submit', function(e) {
    e.preventDefault();

    const fullname = $('#registerForm input[placeholder="Họ và tên"]').val().trim();
    const email = $('#registerForm input[placeholder="Email"]').val().trim();
    const password = $('#registerForm input[placeholder="Mật khẩu"]').val().trim();
    const confirmPassword = $('#registerForm input[placeholder="Nhập lại mật khẩu"]').val().trim();

    if (fullname === '' || email === '' || password === '' || confirmPassword === '') {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
    }

    if (fullname.charAt(0) !== fullname.charAt(0).toUpperCase()) {
        alert('Tên phải viết hoa chữ cái đầu.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Mật khẩu và xác nhận mật khẩu không khớp.');
        return;
    }

    const newUser = {
        fullname: fullname,
        email: email,
        password: password
    };

    localStorage.setItem('registeredUser', JSON.stringify(newUser));

    alert('Đăng ký thành công!');

    $('#registerModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();

    $('#registerForm input').val('');
});

$('#loginForm').on('submit', function(e) {
    e.preventDefault();

    const email = $('#loginForm input[placeholder="Email"]').val().trim();
    const password = $('#loginForm input[placeholder="Mật khẩu"]').val().trim();

    if (email === '' || password === '') {
        alert('Vui lòng nhập email và mật khẩu.');
        return;
    }

    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (!registeredUser) {
        alert('Tài khoản chưa được đăng ký.');
        return;
    }

    if (email !== registeredUser.email || password !== registeredUser.password) {
        alert('Email hoặc mật khẩu không đúng.');
        return;
    }

    alert('Đăng nhập thành công! Chào mừng bạn ' + registeredUser.fullname);

    $('#loginModal').modal('hide');

    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
});