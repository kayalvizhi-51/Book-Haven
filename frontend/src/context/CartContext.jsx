import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Cart Context & Provider
 * Fulfills Module 3 (Cart and Order Management) & Unit V (State, Props, Data Flow, Hooks)
 */

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage for persistence across page refreshes
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('haven_cart_items');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage whenever cartItems changes (Unit V useEffect)
  useEffect(() => {
    try {
      localStorage.setItem('haven_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart items:', e);
    }
  }, [cartItems]);

  /**
   * Add book to cart with stock validation
   */
  const addToCart = (book, quantity = 1) => {
    if (!book || book.stock <= 0) {
      return { success: false, message: 'Sorry, this book is currently out of stock.' };
    }

    let message = '';
    let success = true;

    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === book.id);

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > book.stock) {
          success = false;
          message = `Cannot add more than ${book.stock} available copies in stock.`;
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        message = `Updated "${book.title}" quantity to ${newQty}.`;
        return updated;
      } else {
        if (quantity > book.stock) {
          success = false;
          message = `Cannot add more than ${book.stock} available copies.`;
          return prevItems;
        }

        message = `Added "${book.title}" to your cart!`;
        return [
          ...prevItems,
          {
            id: book.id,
            title: book.title,
            author: book.author,
            price: Number(book.price),
            stock: Number(book.stock),
            cover_image: book.cover_image,
            category_name: book.category_name,
            quantity: quantity
          }
        ];
      }
    });

    return { success, message };
  };

  /**
   * Update quantity of a book in cart
   */
  const updateQuantity = (bookId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === bookId) {
          // Cap at available stock
          const validatedQty = Math.min(qty, item.stock);
          return { ...item, quantity: validatedQty };
        }
        return item;
      })
    );
  };

  /**
   * Remove item completely from cart
   */
  const removeFromCart = (bookId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
  };

  /**
   * Clear all items in cart after successful order placement
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // Computed values (Unit II / V data calculations)
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Standard shipping (free if order > $50 or empty)
  const shippingCost = cartItems.length === 0 || subtotalPrice >= 50 ? 0.00 : 4.99;
  
  // Tax calculation (5% standard sales tax)
  const taxAmount = Number((subtotalPrice * 0.05).toFixed(2));

  // Grand total
  const totalPrice = Number((subtotalPrice + shippingCost + taxAmount).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotalPrice: Number(subtotalPrice.toFixed(2)),
        shippingCost,
        taxAmount,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
