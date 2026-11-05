import { useEffect, useMemo, useState } from 'react'

const SHOP_NAME = 'Biryani House'
const PHONE_DISPLAY = '98765 43210'
const PHONE_TEL = '+919876543210'
const WHATSAPP_NUMBER = '919876543210'
const MAP_QUERY = 'Biryani House, Hyderabad'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80'

const MENU = [
  {
    id: 'chicken',
    name: 'Chicken Biryani',
    price: 250,
    desc: 'Tender chicken slow-cooked dum style with saffron basmati and fried onions.',
    image:
      'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80',
    tag: 'Bestseller',
    veg: false,
  },
  {
    id: 'mutton',
    name: 'Mutton Biryani',
    price: 350,
    desc: 'Juicy mutton marinated overnight, layered with fragrant rice and whole spices.',
    image:
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    tag: "Chef's Special",
    veg: false,
  },
  {
    id: 'veg',
    name: 'Veg Biryani',
    price: 180,
    desc: 'Garden-fresh vegetables, paneer and aromatic spices in long-grain basmati.',
    image:
      'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80',
    tag: 'Pure Veg',
    veg: true,
  },
]

const formatRs = (n) => `Rs.${n.toLocaleString('en-IN')}`

function buildWhatsAppLink(cartItems, total) {
  let text
  if (cartItems.length === 0) {
    text = `Hi ${SHOP_NAME}! I'd like to place an order.`
  } else {
    const lines = cartItems.map(
      (i, idx) => `${idx + 1}. ${i.name} x ${i.qty} = ${formatRs(i.price * i.qty)}`,
    )
    text = [
      `Hi ${SHOP_NAME}! I'd like to order:`,
      '',
      ...lines,
      '',
      `*Total: ${formatRs(total)}*`,
      '',
      'Name:',
      'Address:',
    ].join('\n')
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

function WhatsAppIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.21-3.57.94.95-3.48-.22-.36a9.41 9.41 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.44 9.44zm8.04-17.48A11.3 11.3 0 0 0 12.04.7C5.77.7.67 5.8.67 12.06c0 2 .52 3.96 1.52 5.68L.57 23.7l6.1-1.6a11.33 11.33 0 0 0 5.36 1.37h.01c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04z" />
    </svg>
  )
}

function CartIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
    </svg>
  )
}

function SafeImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-orange-400 to-amber-500 text-6xl`}>
        🍛
      </div>
    )
  }
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
}

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('biryani-cart')) || {}
    } catch {
      return {}
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem('biryani-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(t)
  }, [toast])

  const cartItems = useMemo(
    () =>
      MENU.filter((m) => cart[m.id] > 0).map((m) => ({ ...m, qty: cart[m.id] })),
    [cart],
  )
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0)
  const total = cartItems.reduce((s, i) => s + i.qty * i.price, 0)
  const waLink = buildWhatsAppLink(cartItems, total)

  const addToCart = (item) => {
    setCart((c) => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }))
    setToast(`${item.name} added to cart`)
  }
  const changeQty = (id, delta) =>
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) + delta) }
      if (next[id] === 0) delete next[id]
      return next
    })
  const clearCart = () => setCart({})

  const navLinks = [
    { href: '#menu', label: 'Menu' },
    { href: '#cart', label: 'Cart' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#home" className="flex items-center gap-2">
            <span className="text-3xl">🍛</span>
            <span className="font-display text-xl font-extrabold text-orange-600 sm:text-2xl">
              {SHOP_NAME}
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="font-medium text-stone-700 transition hover:text-orange-600">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-full bg-orange-500 p-2.5 text-white shadow-md transition hover:bg-orange-600"
              aria-label="Open cart"
            >
              <CartIcon className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1 text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-lg p-2 text-stone-700 md:hidden"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                ) : (
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="border-t border-orange-100 bg-white px-4 py-2 md:hidden">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 font-medium text-stone-700 hover:text-orange-600"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-yellow-300/30 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-red-500/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="text-center text-white md:text-left">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
              🔥 Fresh Dum Biryani Every Day
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Authentic Hyderabadi <span className="text-yellow-200">Biryani</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg text-orange-50 md:mx-0">
              Slow-cooked on dum with hand-picked spices, saffron and the finest basmati rice.
              Hot, fresh and delivered to your door.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-green-600"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Order on WhatsApp
              </a>
              <a
                href="#menu"
                className="inline-flex items-center justify-center rounded-full border-2 border-white px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-orange-600"
              >
                View Menu
              </a>
            </div>
            <div className="mt-10 flex justify-center gap-8 text-orange-50 md:justify-start">
              <div>
                <p className="text-2xl font-bold text-white">4.8★</p>
                <p className="text-sm">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">30 min</p>
                <p className="text-sm">Delivery</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">5000+</p>
                <p className="text-sm">Happy Customers</p>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 rotate-6 rounded-[2.5rem] bg-yellow-300/40" />
            <SafeImage
              src={HERO_IMAGE}
              alt="Plate of delicious biryani"
              className="relative aspect-square w-full rounded-[2.5rem] object-cover shadow-2xl ring-8 ring-white/20"
            />
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-widest text-orange-500">Our Menu</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-stone-900 sm:text-4xl">
            Pick Your Favourite Biryani
          </h2>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MENU.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-md shadow-orange-100 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative overflow-hidden">
                <SafeImage
                  src={item.image}
                  alt={item.name}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                  {item.tag}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-xl font-bold text-stone-900">
                    <span
                      className={`flex h-4 w-4 items-center justify-center border-2 ${item.veg ? 'border-green-600' : 'border-red-600'}`}
                      title={item.veg ? 'Veg' : 'Non-veg'}
                    >
                      <span className={`h-2 w-2 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`} />
                    </span>
                    {item.name}
                  </h3>
                  <span className="whitespace-nowrap text-xl font-bold text-orange-600">
                    {formatRs(item.price)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-stone-500">{item.desc}</p>
                {cart[item.id] ? (
                  <div className="mt-5 flex items-center justify-between rounded-full bg-orange-50 p-1">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="h-10 w-10 rounded-full bg-white text-xl font-bold text-orange-600 shadow"
                      aria-label={`Remove one ${item.name}`}
                    >
                      −
                    </button>
                    <span className="font-semibold">{cart[item.id]} in cart</span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="h-10 w-10 rounded-full bg-orange-500 text-xl font-bold text-white shadow"
                      aria-label={`Add one ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-5 w-full rounded-full bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 active:scale-95"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Cart section */}
      <section id="cart" className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-widest text-orange-500">Your Order</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-stone-900 sm:text-4xl">Cart</h2>
          </div>
          <div className="mt-10 rounded-3xl border border-orange-100 bg-orange-50/60 p-6 shadow-sm">
            <CartContents
              cartItems={cartItems}
              total={total}
              changeQty={changeQty}
              clearCart={clearCart}
              waLink={waLink}
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-widest text-orange-500">Visit Us</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-stone-900 sm:text-4xl">Contact & Location</h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-5">
          <div className="space-y-5 md:col-span-2">
            <ContactCard icon="📞" title="Call Us">
              <a href={`tel:${PHONE_TEL}`} className="text-lg font-semibold text-orange-600 hover:underline">
                {PHONE_DISPLAY}
              </a>
            </ContactCard>
            <ContactCard icon="💬" title="WhatsApp">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-green-600 hover:underline"
              >
                {PHONE_DISPLAY}
              </a>
            </ContactCard>
            <ContactCard icon="📍" title="Address">
              <p className="text-stone-600">12, Food Street, Banjara Hills, Hyderabad, Telangana 500034</p>
            </ContactCard>
            <ContactCard icon="🕒" title="Opening Hours">
              <p className="text-stone-600">Mon – Sun: 11:00 AM – 11:00 PM</p>
            </ContactCard>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-lg md:col-span-3">
            <iframe
              title="Shop location on Google Maps"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
              className="h-80 w-full border-0 md:h-full md:min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 py-10 text-center text-stone-400">
        <p className="font-display text-2xl font-bold text-orange-500">🍛 {SHOP_NAME}</p>
        <p className="mt-2 text-sm">Authentic dum biryani, made with love.</p>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.</p>
      </footer>

      {/* Cart drawer */}
      <div
        className={`fixed inset-0 z-50 transition ${cartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!cartOpen}
      >
        <div
          onClick={() => setCartOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity ${cartOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-orange-100 p-5">
            <h3 className="font-display text-2xl font-bold">Your Cart</h3>
            <button
              onClick={() => setCartOpen(false)}
              className="rounded-full p-2 text-stone-500 hover:bg-orange-50"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <CartContents
              cartItems={cartItems}
              total={total}
              changeQty={changeQty}
              clearCart={clearCart}
              waLink={waLink}
            />
          </div>
        </aside>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-green-500 p-4 text-white shadow-xl shadow-green-900/30 transition hover:scale-105 hover:bg-green-600"
        aria-label="Send order on WhatsApp"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-green-400 opacity-40" />
        <WhatsAppIcon className="h-7 w-7" />
        {itemCount > 0 && (
          <span className="hidden pr-1 font-semibold sm:inline">
            Send Order · {formatRs(total)}
          </span>
        )}
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold sm:hidden">
            {itemCount}
          </span>
        )}
      </a>

      {/* Toast */}
      <div
        className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all ${toast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
      >
        ✅ {toast}
      </div>
    </div>
  )
}

function CartContents({ cartItems, total, changeQty, clearCart, waLink }) {
  if (cartItems.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-5xl">🛒</p>
        <p className="mt-3 font-medium text-stone-600">Your cart is empty</p>
        <a href="#menu" className="mt-4 inline-block font-semibold text-orange-600 hover:underline">
          Browse the menu →
        </a>
      </div>
    )
  }

  return (
    <div>
      <ul className="divide-y divide-orange-100">
        {cartItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="truncate font-semibold text-stone-900">{item.name}</p>
              <p className="text-sm text-stone-500">{formatRs(item.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeQty(item.id, -1)}
                className="h-8 w-8 rounded-full border border-orange-200 bg-white font-bold text-orange-600"
                aria-label={`Decrease ${item.name}`}
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{item.qty}</span>
              <button
                onClick={() => changeQty(item.id, 1)}
                className="h-8 w-8 rounded-full bg-orange-500 font-bold text-white"
                aria-label={`Increase ${item.name}`}
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-semibold text-stone-900">{formatRs(item.price * item.qty)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-orange-200 pt-4">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-extrabold text-orange-600">{formatRs(total)}</span>
      </div>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-green-500 py-3.5 font-semibold text-white shadow-lg transition hover:bg-green-600"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Send Order on WhatsApp
      </a>
      <button
        onClick={clearCart}
        className="mt-3 w-full rounded-full py-2 text-sm font-medium text-stone-500 hover:text-red-600"
      >
        Clear cart
      </button>
    </div>
  )
}

function ContactCard({ icon, title, children }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-stone-400">{title}</p>
        {children}
      </div>
    </div>
  )
}
