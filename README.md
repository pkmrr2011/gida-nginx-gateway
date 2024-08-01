## Installation

Clone the Inventory NGINX Gateway repository

```bash
  git clone https://pkmrr2011/gida-nginx-gateway
```

Git repositories contain submodules that must be fetched. It requires HTTP-based URL by default in the `.gitmodules` file. Copy this into `.gitmodules` file

```bash
[submodule "gida_auth_backend"]
	path = gida_auth_backend
	url = https://pkmrr2011/gida_auth_backend
[submodule "gida_cart_backend"]
	path = gida_cart_backend
	url = https://pkmrr2011/gida_cart_backend
[submodule "gida_product_backend"]
	path = gida_product_backend
	url = https://pkmrr2011/gida_product_backend

```

After that Run these commands

```bash
git submodule init

```

```bash
git submodule update
```
