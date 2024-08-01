## Inventory NGINX Gateway Microservice Project

### Installation

1. **Clone the Project**
   ```bash
   git clone https://github.com/pkmrr2011/gida-nginx-gateway.git
   ```

2. **Navigate to the Project Folder**
   ```bash
   cd gida-nginx-gateway
   ```

3. **Run Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

4. **Setup `auth_backend`**
   ```bash
   cd auth_backend
   npm install
   cp .env.example .env
   ```

5. **Setup `carts_backend`**
   ```bash
   cd ../carts_backend
   npm install
   cp .env.example .env
   ```

6. **Setup `products_backend`**
   ```bash
   cd ../products_backend
   npm install
   cp .env.example .env
   ```

### API List

#### AUTH BACKEND
1. **Send OTP**
   - **URL:** `localhost:81/api/v1/users/sent-otp`
   - **Method:** POST
   - **Body Parameters:**
     - `phone_number` (10 digit string)
     - `name`

   ```bash
   curl --location 'http://localhost:81/api/v1/users/send-otp' \
   --header 'Content-Type: application/json' \
   --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
   --data '{
       "phone_number": "9958162754",
       "name": "Prince Kumar"
   }'
   ```

2. **Login**
   - **URL:** `localhost:81/api/v1/users/login`
   - **Method:** POST
   - **Body Parameters:**
     - `phone_number`
     - `otp` (4 digit string)

   ```bash
   curl --location 'http://localhost:81/api/v1/users/login' \
   --header 'Content-Type: application/json' \
   --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
   --data '{
       "phone_number": "9958162754",
       "otp": "3179"
   }'
   ```

3. **Get Users**
   - **URL:** `localhost:81/api/v1/users`
   - **Method:** GET
   - **Query Parameters (optional):**
     - `id`
     - `limit`
     - `offset`

   ```bash
   curl --location 'http://localhost:81/api/v1/users' \
   --header 'Content-Type: application/json' \
   --header 'Authorization: Bearer YOUR_JWT_TOKEN'
   ```

#### PRODUCT BACKEND
1. **Get Products**
   - **URL:** `localhost:81/api/v1/products`
   - **Method:** GET
   - **Query Parameters (optional):**
     - `id`
     - `limit`
     - `offset`
     - `search`

   ```bash
   curl --location 'http://localhost:81/api/v1/products' \
   --header 'Content-Type: application/json' \
   --header 'Authorization: Bearer YOUR_JWT_TOKEN'
   ```

2. **Get Product by SKU**
   - **URL:** `localhost:81/api/v1/products/:sku`
   - **Method:** GET

   ```bash
   curl --location 'http://localhost:81/api/v1/products/SKU028' \
   --header 'Content-Type: application/json' \
   --header 'Authorization: Bearer YOUR_JWT_TOKEN'
   ```

#### CART BACKEND
1. **Add to Cart**
   - **URL:** `localhost:81/api/v1/carts/add-to-cart`
   - **Method:** POST
   - **Body Parameters:**
     - `userId` (int value)
     - `productId` (int value)
     - `quantity` (int value)

   ```bash
   curl --location 'http://localhost:81/api/v1/carts/add-to-cart' \
   --header 'Content-Type: application/json' \
   --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
   --data '{
       "userId": 1,
       "productId": 22,
       "quantity": 1
   }'
   ```