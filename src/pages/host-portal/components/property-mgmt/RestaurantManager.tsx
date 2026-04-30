import { useState, useEffect } from 'react';
import { RestaurantMenuItem, RestaurantOrder, RestaurantOrderItem, MenuCategory } from '@/pages/admin/types';
import { loadHostData, saveHostData } from '@/pages/admin/hostStore';

interface Props {
  propertyId: string;
  propertyName: string;
  hostId: string;
}

type SubTab = 'menu' | 'orders' | 'new-order';

const CATEGORIES: { value: MenuCategory; label: string; icon: string }[] = [
  { value: 'breakfast', label: 'Breakfast', icon: 'ri-sun-line' },
  { value: 'lunch', label: 'Lunch', icon: 'ri-restaurant-2-line' },
  { value: 'dinner', label: 'Dinner', icon: 'ri-moon-line' },
  { value: 'snacks', label: 'Snacks', icon: 'ri-cake-2-line' },
  { value: 'beverages', label: 'Beverages', icon: 'ri-cup-line' },
  { value: 'desserts', label: 'Desserts', icon: 'ri-goblet-line' },
  { value: 'specials', label: "Chef's Specials", icon: 'ri-award-line' },
];

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  preparing: 'bg-blue-100 text-blue-700',
  served: 'bg-emerald-100 text-emerald-700',
  billed: 'bg-stone-100 text-stone-500',
  cancelled: 'bg-red-100 text-red-600',
};

const ORDER_STATUS_FLOW: Record<string, string> = {
  pending: 'preparing',
  preparing: 'served',
  served: 'billed',
};

const emptyMenuItem = (propertyId: string): RestaurantMenuItem => ({
  id: `mi_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  propertyId,
  name: '',
  category: 'lunch',
  price: 0,
  description: '',
  isVeg: true,
  isAvailable: true,
  preparationTime: 15,
});

export default function RestaurantManager({ propertyId, propertyName }: Props) {
  const [subTab, setSubTab] = useState<SubTab>('menu');
  const [menuItems, setMenuItems] = useState<RestaurantMenuItem[]>([]);
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);

  // Menu editing state
  const [menuView, setMenuView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingItem, setEditingItem] = useState<RestaurantMenuItem | null>(null);
  const [menuForm, setMenuForm] = useState<RestaurantMenuItem>(emptyMenuItem(propertyId));
  const [filterCategory, setFilterCategory] = useState<MenuCategory | 'all'>('all');

  // Order creation state
  const [orderGuestName, setOrderGuestName] = useState('');
  const [orderRoom, setOrderRoom] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderItems, setOrderItems] = useState<{ item: RestaurantMenuItem; qty: number }[]>([]);
  const [orderSearch, setOrderSearch] = useState('');

  const [saved, setSaved] = useState('');

  useEffect(() => {
    const data = loadHostData();
    const allMenuItems: RestaurantMenuItem[] = (data as any).restaurantMenuItems ?? [];
    const allOrders: RestaurantOrder[] = (data as any).restaurantOrders ?? [];
    setMenuItems(allMenuItems.filter((m) => m.propertyId === propertyId));
    setOrders(allOrders.filter((o) => o.propertyId === propertyId));
  }, [propertyId]);

  const persistMenu = (updated: RestaurantMenuItem[]) => {
    const data = loadHostData();
    const all: RestaurantMenuItem[] = (data as any).restaurantMenuItems ?? [];
    const others = all.filter((m) => m.propertyId !== propertyId);
    (data as any).restaurantMenuItems = [...others, ...updated];
    saveHostData(data);
    setMenuItems(updated);
  };

  const persistOrders = (updated: RestaurantOrder[]) => {
    const data = loadHostData();
    const all: RestaurantOrder[] = (data as any).restaurantOrders ?? [];
    const others = all.filter((o) => o.propertyId !== propertyId);
    (data as any).restaurantOrders = [...others, ...updated];
    saveHostData(data);
    setOrders(updated);
  };

  // Menu CRUD
  const handleMenuSave = () => {
    if (!menuForm.name || !menuForm.price) return;
    if (menuView === 'edit' && editingItem) {
      persistMenu(menuItems.map((m) => m.id === editingItem.id ? menuForm : m));
    } else {
      persistMenu([...menuItems, menuForm]);
    }
    setSaved('menu');
    setTimeout(() => setSaved(''), 2000);
    setMenuView('list');
  };

  const handleMenuDelete = (id: string) => {
    if (!window.confirm('Remove this menu item?')) return;
    persistMenu(menuItems.filter((m) => m.id !== id));
  };

  const handleToggleAvailability = (id: string) => {
    persistMenu(menuItems.map((m) => m.id === id ? { ...m, isAvailable: !m.isAvailable } : m));
  };

  // Order helpers
  const addToOrder = (item: RestaurantMenuItem) => {
    const existing = orderItems.find((o) => o.item.id === item.id);
    if (existing) {
      setOrderItems(orderItems.map((o) => o.item.id === item.id ? { ...o, qty: o.qty + 1 } : o));
    } else {
      setOrderItems([...orderItems, { item, qty: 1 }]);
    }
  };

  const updateQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setOrderItems(orderItems.filter((o) => o.item.id !== itemId));
    } else {
      setOrderItems(orderItems.map((o) => o.item.id === itemId ? { ...o, qty } : o));
    }
  };

  const orderTotal = orderItems.reduce((s, o) => s + o.item.price * o.qty, 0);

  const handlePlaceOrder = () => {
    if (!orderGuestName || orderItems.length === 0) return;
    const items: RestaurantOrderItem[] = orderItems.map((o) => ({
      menuItemId: o.item.id,
      menuItemName: o.item.name,
      quantity: o.qty,
      unitPrice: o.item.price,
      totalPrice: o.item.price * o.qty,
    }));
    const newOrder: RestaurantOrder = {
      id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      propertyId,
      guestName: orderGuestName,
      roomNumber: orderRoom,
      items,
      totalAmount: orderTotal,
      status: 'pending',
      addedToInvoice: false,
      notes: orderNotes,
      orderedAt: new Date().toISOString(),
    };
    persistOrders([...orders, newOrder]);
    setOrderGuestName(''); setOrderRoom(''); setOrderNotes(''); setOrderItems([]);
    setSaved('order');
    setTimeout(() => setSaved(''), 2000);
    setSubTab('orders');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: RestaurantOrder['status']) => {
    persistOrders(orders.map((o) => o.id === orderId ? { ...o, status: newStatus, servedAt: newStatus === 'served' ? new Date().toISOString() : o.servedAt } : o));
  };

  const handleAddToInvoice = (orderId: string) => {
    persistOrders(orders.map((o) => o.id === orderId ? { ...o, addedToInvoice: true, status: 'billed' } : o));
    setSaved('invoice');
    setTimeout(() => setSaved(''), 2000);
  };

  const handleCancelOrder = (orderId: string) => {
    persistOrders(orders.map((o) => o.id === orderId ? { ...o, status: 'cancelled' } : o));
  };

  const filteredMenu = filterCategory === 'all' ? menuItems : menuItems.filter((m) => m.category === filterCategory);
  const availableForOrder = menuItems.filter((m) => m.isAvailable && (orderSearch === '' || m.name.toLowerCase().includes(orderSearch.toLowerCase())));
  const activeOrders = orders.filter((o) => !['billed', 'cancelled'].includes(o.status));
  const billedOrders = orders.filter((o) => o.status === 'billed');

  // Menu edit form view
  if (subTab === 'menu' && (menuView === 'add' || menuView === 'edit')) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setMenuView('list')} className="text-stone-400 hover:text-stone-700 cursor-pointer"><i className="ri-arrow-left-line text-xl" /></button>
          <div>
            <h3 className="text-xl font-bold text-stone-900">{menuView === 'edit' ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
            <p className="text-stone-400 text-xs">{propertyName}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-6 max-w-xl space-y-4">
          {/* Category picker */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Category *</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setMenuForm({ ...menuForm, category: cat.value })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    menuForm.category === cat.value ? 'bg-rose-50 text-rose-700 border-rose-200' : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  <i className={cat.icon} />{cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Item Name *</label>
              <input value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. Grilled Chicken Salad" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Price (₹) *</label>
              <input type="number" value={menuForm.price || ''} onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="450" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Prep Time (mins)</label>
              <input type="number" value={menuForm.preparationTime ?? ''} onChange={(e) => setMenuForm({ ...menuForm, preparationTime: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400" placeholder="20" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
              <textarea value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 resize-none" placeholder="Brief description..." />
            </div>
            <div className="col-span-2 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={menuForm.isVeg} onChange={(e) => setMenuForm({ ...menuForm, isVeg: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm text-stone-700">Vegetarian</span>
                <span className="text-emerald-500 text-xs">{menuForm.isVeg ? '🟢 Veg' : ''}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={menuForm.isAvailable} onChange={(e) => setMenuForm({ ...menuForm, isAvailable: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm text-stone-700">Available</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setMenuView('list')} className="px-6 py-2.5 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap">Cancel</button>
            <button onClick={handleMenuSave} disabled={!menuForm.name || !menuForm.price} className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap disabled:opacity-50">
              {menuView === 'edit' ? 'Save Changes' : 'Add to Menu'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-stone-800">{propertyName} — Restaurant</h3>
          <p className="text-stone-400 text-xs mt-0.5">Manage menu, take in-room orders, and add to guest invoices</p>
        </div>
        {saved && <span className="text-emerald-600 text-sm flex items-center gap-1"><i className="ri-check-line" /> {saved === 'invoice' ? 'Added to Invoice!' : saved === 'order' ? 'Order Placed!' : 'Saved!'}</span>}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 mb-5 bg-stone-100 p-1 rounded-xl w-fit">
        {[
          { id: 'menu' as SubTab, label: 'Menu', icon: 'ri-menu-2-line', count: menuItems.length },
          { id: 'new-order' as SubTab, label: 'New Order', icon: 'ri-add-circle-line', count: orderItems.length || undefined },
          { id: 'orders' as SubTab, label: 'Active Orders', icon: 'ri-list-check-3', count: activeOrders.length || undefined },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              subTab === tab.id ? 'bg-white text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <i className={tab.icon} />{tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`ml-0.5 px-1.5 py-0.5 text-xs rounded-full font-bold ${subTab === tab.id ? 'bg-rose-100 text-rose-600' : 'bg-stone-200 text-stone-500'}`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── MENU TAB ── */}
      {subTab === 'menu' && (
        <div>
          {/* Category filter */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <button onClick={() => setFilterCategory('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap transition-all ${filterCategory === 'all' ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}>All ({menuItems.length})</button>
            {CATEGORIES.filter((c) => menuItems.some((m) => m.category === c.value)).map((cat) => (
              <button key={cat.value} onClick={() => setFilterCategory(cat.value)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap border transition-all ${filterCategory === cat.value ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white border-stone-200 text-stone-600'}`}>
                <i className={cat.icon} />{cat.label} ({menuItems.filter((m) => m.category === cat.value).length})
              </button>
            ))}
            <button onClick={() => { setMenuForm(emptyMenuItem(propertyId)); setEditingItem(null); setMenuView('add'); }} className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 cursor-pointer whitespace-nowrap">
              <i className="ri-add-line" /> Add Item
            </button>
          </div>

          {menuItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-stone-200">
              <div className="w-14 h-14 flex items-center justify-center bg-rose-50 rounded-2xl mx-auto mb-4"><i className="ri-restaurant-2-line text-rose-400 text-2xl" /></div>
              <p className="font-semibold text-stone-700 mb-2">No menu items yet</p>
              <p className="text-stone-400 text-sm mb-5 max-w-xs mx-auto">Build your restaurant menu with breakfast, lunch, dinner, snacks, beverages and more.</p>
              <button onClick={() => { setMenuForm(emptyMenuItem(propertyId)); setEditingItem(null); setMenuView('add'); }} className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap">Add First Item</button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMenu.map((item) => {
                const cat = CATEGORIES.find((c) => c.value === item.category);
                return (
                  <div key={item.id} className={`bg-white rounded-xl border border-stone-200 px-4 py-3 flex items-center gap-3 ${!item.isAvailable ? 'opacity-60' : ''}`}>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${item.isVeg ? 'bg-emerald-50' : 'bg-rose-50'} shrink-0`}>
                      <i className={`${item.isVeg ? 'ri-leaf-line text-emerald-500' : 'ri-knife-blood-line text-rose-400'} text-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-stone-900 text-sm">{item.name}</span>
                        {cat && <span className="text-xs text-stone-400 flex items-center gap-0.5"><i className={cat.icon} />{cat.label}</span>}
                        {item.preparationTime && <span className="text-xs text-stone-400"><i className="ri-time-line mr-0.5" />{item.preparationTime}m</span>}
                      </div>
                      {item.description && <p className="text-stone-400 text-xs mt-0.5 line-clamp-1">{item.description}</p>}
                    </div>
                    <span className="font-bold text-stone-900 text-sm shrink-0">₹{item.price}</span>
                    <button onClick={() => handleToggleAvailability(item.id)} className={`px-2 py-1 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap border transition-all ${item.isAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-stone-100 text-stone-400 border-stone-200'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setEditingItem(item); setMenuForm({ ...item }); setMenuView('edit'); }} className="w-7 h-7 flex items-center justify-center border border-stone-200 rounded-lg text-stone-400 hover:bg-stone-50 cursor-pointer"><i className="ri-edit-line text-xs" /></button>
                      <button onClick={() => handleMenuDelete(item.id)} className="w-7 h-7 flex items-center justify-center border border-red-100 rounded-lg text-red-400 hover:bg-red-50 cursor-pointer"><i className="ri-delete-bin-line text-xs" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── NEW ORDER TAB ── */}
      {subTab === 'new-order' && (
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Menu picker */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 relative">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400"
                  placeholder="Search menu items..."
                />
              </div>
            </div>
            {menuItems.filter((m) => m.isAvailable).length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-stone-200">
                <p className="text-stone-400 text-sm">No available menu items. Add items in the Menu tab first.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {availableForOrder.map((item) => {
                  const inOrder = orderItems.find((o) => o.item.id === item.id);
                  return (
                    <div key={item.id} className="bg-white rounded-xl border border-stone-200 px-4 py-3 flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 ${item.isVeg ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                        <i className={`${item.isVeg ? 'ri-leaf-line text-emerald-500' : 'ri-knife-blood-line text-rose-400'} text-sm`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900 text-sm">{item.name}</p>
                        <p className="text-stone-400 text-xs">₹{item.price} · {CATEGORIES.find((c) => c.value === item.category)?.label}</p>
                      </div>
                      {inOrder ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => updateQty(item.id, inOrder.qty - 1)} className="w-7 h-7 flex items-center justify-center border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50"><i className="ri-subtract-line text-sm" /></button>
                          <span className="w-6 text-center font-semibold text-stone-900 text-sm">{inOrder.qty}</span>
                          <button onClick={() => updateQty(item.id, inOrder.qty + 1)} className="w-7 h-7 flex items-center justify-center bg-stone-900 text-white rounded-lg cursor-pointer hover:bg-stone-700"><i className="ri-add-line text-sm" /></button>
                        </div>
                      ) : (
                        <button onClick={() => addToOrder(item)} className="flex items-center gap-1 px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer whitespace-nowrap">
                          <i className="ri-add-line" /> Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order summary panel */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border border-stone-200 p-5 sticky top-24">
              <h4 className="font-bold text-stone-900 mb-4 flex items-center gap-2"><i className="ri-receipt-line text-rose-500" />Order Summary</h4>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Guest Name *</label>
                  <input value={orderGuestName} onChange={(e) => setOrderGuestName(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="Guest name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Room / Villa No.</label>
                  <input value={orderRoom} onChange={(e) => setOrderRoom(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400" placeholder="e.g. Room 102 / Villa 3" />
                </div>
              </div>

              {orderItems.length === 0 ? (
                <div className="py-6 text-center border-2 border-dashed border-stone-100 rounded-xl mb-4">
                  <i className="ri-restaurant-line text-stone-300 text-3xl block mb-2" />
                  <p className="text-stone-400 text-xs">Add items from the menu</p>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {orderItems.map((o) => (
                    <div key={o.item.id} className="flex items-center gap-2 text-sm">
                      <span className="flex-1 text-stone-700">{o.item.name}</span>
                      <span className="text-stone-400 text-xs">x{o.qty}</span>
                      <span className="font-medium text-stone-900">₹{(o.item.price * o.qty).toLocaleString('en-IN')}</span>
                      <button onClick={() => updateQty(o.item.id, 0)} className="w-5 h-5 flex items-center justify-center text-stone-300 hover:text-red-400 cursor-pointer"><i className="ri-close-line text-xs" /></button>
                    </div>
                  ))}
                  <div className="border-t border-stone-100 pt-2 flex justify-between items-center">
                    <span className="text-sm font-semibold text-stone-700">Total</span>
                    <span className="font-bold text-stone-900">₹{orderTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="block text-xs font-medium text-stone-600 mb-1">Notes</label>
                <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} rows={2} className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 resize-none" placeholder="Allergies, preferences..." />
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!orderGuestName || orderItems.length === 0}
                className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Place Order · ₹{orderTotal.toLocaleString('en-IN')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {subTab === 'orders' && (
        <div className="space-y-5">
          {/* Active orders */}
          {activeOrders.length > 0 && (
            <div>
              <h4 className="font-semibold text-stone-700 text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full inline-block" /> Active Orders ({activeOrders.length})
              </h4>
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateOrderStatus}
                    onAddToInvoice={handleAddToInvoice}
                    onCancel={handleCancelOrder}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Billed/completed */}
          {billedOrders.length > 0 && (
            <div>
              <h4 className="font-semibold text-stone-500 text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-stone-300 rounded-full inline-block" /> Billed ({billedOrders.length})
              </h4>
              <div className="space-y-3">
                {billedOrders.slice(0, 5).map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateOrderStatus}
                    onAddToInvoice={handleAddToInvoice}
                    onCancel={handleCancelOrder}
                  />
                ))}
              </div>
            </div>
          )}

          {orders.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-stone-200">
              <div className="w-14 h-14 flex items-center justify-center bg-rose-50 rounded-2xl mx-auto mb-4"><i className="ri-receipt-line text-rose-300 text-2xl" /></div>
              <p className="font-semibold text-stone-700 mb-2">No orders yet</p>
              <p className="text-stone-400 text-sm mb-4">In-room dining orders will appear here once placed.</p>
              <button onClick={() => setSubTab('new-order')} className="px-5 py-2 bg-stone-900 text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap">Place New Order</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onUpdateStatus,
  onAddToInvoice,
  onCancel,
}: {
  order: RestaurantOrder;
  onUpdateStatus: (id: string, status: RestaurantOrder['status']) => void;
  onAddToInvoice: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const nextStatus = ORDER_STATUS_FLOW[order.status] as RestaurantOrder['status'] | undefined;
  const nextLabel: Record<string, string> = { preparing: 'Mark Preparing', served: 'Mark Served', billed: 'Mark Billed' };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-semibold text-stone-900 text-sm">{order.guestName}</span>
            {order.roomNumber && <span className="text-xs text-stone-400"><i className="ri-door-line mr-0.5" />{order.roomNumber}</span>}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>{order.status}</span>
            {order.addedToInvoice && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700"><i className="ri-file-text-line mr-0.5" />Invoiced</span>}
          </div>
          <p className="text-stone-400 text-xs">{new Date(order.orderedAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</p>
        </div>
        <span className="font-bold text-stone-900 text-sm shrink-0">₹{order.totalAmount.toLocaleString('en-IN')}</span>
      </div>

      {/* Items */}
      <div className="space-y-1 mb-3 pl-2 border-l-2 border-stone-100">
        {order.items.map((item) => (
          <div key={item.menuItemId} className="flex items-center justify-between text-xs text-stone-600">
            <span>{item.menuItemName} <span className="text-stone-400">x{item.quantity}</span></span>
            <span className="font-medium">₹{item.totalPrice}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <p className="text-xs text-stone-400 italic mb-3 bg-stone-50 rounded-lg px-3 py-1.5"><i className="ri-information-line mr-1" />{order.notes}</p>
      )}

      {/* Actions */}
      {!['billed', 'cancelled'].includes(order.status) && (
        <div className="flex gap-2 flex-wrap">
          {nextStatus && (
            <button
              onClick={() => onUpdateStatus(order.id, nextStatus)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap hover:bg-stone-700"
            >
              <i className="ri-arrow-right-line" />{nextLabel[nextStatus]}
            </button>
          )}
          {order.status === 'served' && !order.addedToInvoice && (
            <button
              onClick={() => onAddToInvoice(order.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap hover:bg-violet-700"
            >
              <i className="ri-file-add-line" />Add to Guest Invoice
            </button>
          )}
          <button
            onClick={() => onCancel(order.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-100 text-red-500 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap hover:bg-red-50"
          >
            <i className="ri-close-line" />Cancel
          </button>
        </div>
      )}
    </div>
  );
}
