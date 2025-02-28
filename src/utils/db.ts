import { Product, Order, ShippingInfo } from "./type";

const dbName = "ShoppingCartDB";
const cartStore = "cart";
const orderStore = "order";
let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(cartStore)) {
        db.createObjectStore(cartStore, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(orderStore)) {
        db.createObjectStore(orderStore, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function addToCart(product: Product): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(cartStore, "readwrite");
  const store = transaction.objectStore(cartStore);
  store.add(product);
  return Promise.resolve();
}

export async function removeCart(productId: number): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(cartStore, "readwrite");
  const store = transaction.objectStore(cartStore);
  store.delete(productId);
  return Promise.resolve();
}

export async function getAllFromCart(): Promise<Product[]> {
  const db = await openDB();
  const transaction = db.transaction(cartStore, "readonly");
  const store = transaction.objectStore(cartStore);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as Product[]);
    request.onerror = () => reject(request.error);
  });
}

export async function clearCart(): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(cartStore, "readwrite");
  const store = transaction.objectStore(cartStore);
  store.clear();
  return Promise.resolve();
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await openDB();
  const transaction = db.transaction(orderStore, "readonly");
  const store = transaction.objectStore(orderStore);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as Order[]);
    request.onerror = () => reject(request.error);
  });
}

export async function getOrderById(
  orderId: number
): Promise<Order | undefined> {
  const db = await openDB();
  const transaction = db.transaction(orderStore, "readonly");
  const store = transaction.objectStore(orderStore);
  const request = store.get(orderId);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as Order);
    request.onerror = () => reject(request.error);
  });
}

export async function createOrder({
  items,
  total,
  shippingInfo,
}: {
  items: Product[];
  total: number;
  shippingInfo: ShippingInfo;
}): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(orderStore, "readwrite");
  const store = transaction.objectStore(orderStore);
  store.add({
    shippingInfo,
    cart: items,
    total,
    status: "Received",
    createdAt: new Date().toDateString(),
  });
  return Promise.resolve();
}

export async function updateOrderStatus(
  orderId: number,
  status: "Received" | "Processing" | "Delivered"
): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(orderStore, "readwrite");
  const store = transaction.objectStore(orderStore);
  const request = store.get(orderId);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const order = request.result as Order;
      order.status = status;
      store.put(order);
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}
