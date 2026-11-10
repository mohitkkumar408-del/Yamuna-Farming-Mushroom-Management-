import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  DatabaseState,
  ProductionBatch,
  HarvestRecord,
  MushroomStock,
  RawMaterialItem,
  StockMovement,
  Customer,
  Supplier,
  Order,
  Delivery,
  Expense,
  PaymentTransaction,
  NotificationAlert,
  FarmSettings,
  User,
  OrderStatus,
  DeliveryStatus,
  PaymentMethod,
  MushroomVariety,
} from '../types';
import { StorageService } from '../services/storage';
import { Language, translations } from '../services/i18n';

interface FarmContextType {
  state: DatabaseState;
  lang: Language;
  t: typeof translations.en;
  setLang: (l: Language) => void;
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;

  // Key Aggregated Metrics
  metrics: {
    totalProducedKg: number;
    totalSoldKg: number;
    availableStockKg: number;
    reservedStockKg: number;
    todayHarvestKg: number;
    todaySalesRevenue: number;
    totalSalesRevenue: number;
    cashCollected: number;
    pendingCustomerDues: number;
    totalExpenses: number;
    grossProfit: number;
    netProfit: number;
    profitMarginPct: number;
    costPerKgProduced: number;
    avgSellingPricePerKg: number;
    statusCounts: Record<OrderStatus, number>;
    unreadNotifications: number;
    lowStockItems: MushroomStock[];
    upcomingHarvestBatches: ProductionBatch[];
    dueDeliveriesToday: Delivery[];
  };

  // Actions
  addBatch: (batch: Omit<ProductionBatch, 'id' | 'createdAt' | 'totalHarvestedKg'>) => void;
  updateBatch: (batch: ProductionBatch) => void;
  deleteBatch: (id: string) => void;

  addHarvest: (harvest: Omit<HarvestRecord, 'id' | 'createdAt'>) => void;

  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'orderNumber' | 'deliveredQuantityKg' | 'stockReserved' | 'stockDeducted'>) => { success: boolean; error?: string };
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => { success: boolean; error?: string };
  deleteOrder: (orderId: string) => void;

  addDelivery: (delivery: Omit<Delivery, 'id' | 'createdAt' | 'deliveryCode' | 'deliveredQuantityKg'>) => void;
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus, deliveredQtyKg?: number, remarks?: string) => void;

  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalKgPurchased' | 'totalBilledAmount' | 'totalPaidAmount' | 'balanceDue'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;

  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'totalPurchased' | 'totalPaid' | 'balancePayable'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;

  addPayment: (payment: Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionCode'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;

  adjustStock: (variety: MushroomVariety, newAvailableKg: number, reason: string) => void;
  addRawMaterial: (item: Omit<RawMaterialItem, 'id'>) => void;
  updateRawMaterial: (item: RawMaterialItem) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  updateSettings: (settings: Partial<FarmSettings>) => void;
  resetToCleanData: () => void;
  loadDemoData: () => void;
  importBackup: (json: string) => boolean;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DatabaseState>(() => StorageService.load());
  const [lang, setLang] = useState<Language>(() => state.settings.language || 'en');
  const [currentUser, setCurrentUser] = useState<User | null>(() => state.currentUser || state.users[0]);

  // Persist whenever state changes
  useEffect(() => {
    StorageService.save(state);
  }, [state]);

  const t = translations[lang];

  // Calculated Real-time Business Metrics
  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    const totalProducedKg = state.harvests.reduce((sum, h) => sum + (h.netFreshQtyKg || 0), 0);
    const availableStockKg = state.stocks.reduce((sum, s) => sum + (s.availableKg || 0), 0);
    const reservedStockKg = state.stocks.reduce((sum, s) => sum + (s.reservedKg || 0), 0);

    const nonCancelledOrders = state.orders.filter((o) => o.status !== 'cancelled');
    const totalSoldKg = state.orders
      .filter((o) => o.status === 'delivered' || o.status === 'dispatched')
      .reduce((sum, o) => sum + (o.quantityKg || 0), 0);

    const todayHarvestKg = state.harvests
      .filter((h) => h.harvestDate === todayStr)
      .reduce((sum, h) => sum + (h.netFreshQtyKg || 0), 0);

    const todaySalesRevenue = state.orders
      .filter((o) => o.orderDate === todayStr && o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const totalSalesRevenue = nonCancelledOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const cashCollected = state.payments
      .filter((p) => p.direction === 'in')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pendingCustomerDues = nonCancelledOrders.reduce((sum, o) => sum + (o.balanceDue || 0), 0);

    const totalExpenses = state.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    // COGS based on batch production costs
    const totalBatchCosts = state.batches.reduce((sum, b) => sum + (b.totalCost || 0), 0);
    const costPerKgProduced = totalProducedKg > 0 ? totalBatchCosts / totalProducedKg : 0;
    const estimatedCOGS = totalSoldKg * costPerKgProduced;
    const grossProfit = totalSalesRevenue - estimatedCOGS;
    const netProfit = totalSalesRevenue - totalExpenses;
    const profitMarginPct = totalSalesRevenue > 0 ? (netProfit / totalSalesRevenue) * 100 : 0;
    const avgSellingPricePerKg = totalSoldKg > 0 ? totalSalesRevenue / totalSoldKg : 0;

    const statusCounts: Record<OrderStatus, number> = {
      new: 0,
      confirmed: 0,
      processing: 0,
      ready_for_dispatch: 0,
      dispatched: 0,
      delivered: 0,
      cancelled: 0,
    };
    state.orders.forEach((o) => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    const unreadNotifications = state.notifications.filter((n) => !n.isRead).length;

    const lowStockItems = state.stocks.filter(
      (s) => s.availableKg <= (s.lowStockThresholdKg || state.settings.lowStockThresholdKg)
    );

    const upcomingHarvestBatches = state.batches.filter((b) => {
      if (b.status === 'completed' || b.status === 'cancelled') return false;
      const target = new Date(b.targetHarvestDate).getTime();
      const now = new Date().getTime();
      const diffDays = (target - now) / (1000 * 3600 * 24);
      return diffDays >= -1 && diffDays <= 4;
    });

    const dueDeliveriesToday = state.deliveries.filter(
      (d) => (d.expectedDeliveryDate === todayStr || d.dispatchDate === todayStr) && d.status !== 'delivered'
    );

    return {
      totalProducedKg,
      totalSoldKg,
      availableStockKg,
      reservedStockKg,
      todayHarvestKg,
      todaySalesRevenue,
      totalSalesRevenue,
      cashCollected,
      pendingCustomerDues,
      totalExpenses,
      grossProfit,
      netProfit,
      profitMarginPct,
      costPerKgProduced,
      avgSellingPricePerKg,
      statusCounts,
      unreadNotifications,
      lowStockItems,
      upcomingHarvestBatches,
      dueDeliveriesToday,
    };
  }, [state]);

  // Production Batches
  const addBatch = (batchData: Omit<ProductionBatch, 'id' | 'createdAt' | 'totalHarvestedKg'>) => {
    const id = `bat_${Date.now()}`;
    const newBatch: ProductionBatch = {
      ...batchData,
      id,
      totalHarvestedKg: 0,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      batches: [newBatch, ...prev.batches],
    }));
  };

  const updateBatch = (updated: ProductionBatch) => {
    setState((prev) => ({
      ...prev,
      batches: prev.batches.map((b) => (b.id === updated.id ? updated : b)),
    }));
  };

  const deleteBatch = (id: string) => {
    setState((prev) => ({
      ...prev,
      batches: prev.batches.filter((b) => b.id !== id),
      harvests: prev.harvests.filter((h) => h.batchId !== id),
    }));
  };

  // Harvests & Stock Inflow
  const addHarvest = (harvestData: Omit<HarvestRecord, 'id' | 'createdAt'>) => {
    const id = `harv_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const newHarvest: HarvestRecord = {
      ...harvestData,
      id,
      createdAt: nowIso,
    };

    setState((prev) => {
      // 1. Update batch total harvested kg
      const updatedBatches = prev.batches.map((b) => {
        if (b.id === harvestData.batchId) {
          return {
            ...b,
            totalHarvestedKg: (b.totalHarvestedKg || 0) + harvestData.netFreshQtyKg,
            status: b.status === 'pinheading' || b.status === 'spawn_run' ? ('harvesting' as const) : b.status,
          };
        }
        return b;
      });

      // 2. Increment stock for this variety
      const updatedStocks = prev.stocks.map((s) => {
        if (s.variety.toLowerCase() === harvestData.variety.toLowerCase()) {
          return {
            ...s,
            totalHarvestedKg: s.totalHarvestedKg + harvestData.netFreshQtyKg,
            availableKg: s.availableKg + harvestData.netFreshQtyKg,
            spoiledKg: s.spoiledKg + harvestData.spoiledQtyKg,
            lastUpdated: harvestData.harvestDate,
          };
        }
        return s;
      });

      // 3. Record stock movement
      const newMovement: StockMovement = {
        id: `mov_${Date.now()}`,
        date: harvestData.harvestDate,
        varietyOrItem: harvestData.variety,
        quantityKg: harvestData.netFreshQtyKg,
        movementType: 'harvest_in',
        relatedBatchId: harvestData.batchId,
        reason: `Harvest Flush ${harvestData.flushNumber} from batch ${harvestData.batchCode}`,
        recordedBy: harvestData.harvestedBy || currentUser?.name || 'Farm Staff',
        createdAt: nowIso,
      };

      return {
        ...prev,
        batches: updatedBatches,
        harvests: [newHarvest, ...prev.harvests],
        stocks: updatedStocks,
        movements: [newMovement, ...prev.movements],
      };
    });
  };

  // Orders Management with FIFO and Reservation Safeguards
  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'orderNumber' | 'deliveredQuantityKg' | 'stockReserved' | 'stockDeducted'>) => {
    const stock = state.stocks.find((s) => s.variety.toLowerCase() === orderData.variety.toLowerCase());
    const available = stock ? stock.availableKg : 0;

    const willReserve = ['confirmed', 'processing', 'ready_for_dispatch'].includes(orderData.status);
    if (willReserve && available < orderData.quantityKg) {
      return {
        success: false,
        error: `Insufficient available stock for ${orderData.variety}. Available: ${available.toFixed(1)} kg, Requested: ${orderData.quantityKg} kg. Please check current inventory or select a different variety.`,
      };
    }

    const orderNumber = `YF-ORD-${new Date().getFullYear()}-${String(state.orders.length + 1).padStart(3, '0')}`;
    const id = `ord_${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      deliveredQuantityKg: 0,
      stockReserved: willReserve,
      stockDeducted: false,
      createdAt: nowIso,
    };

    setState((prev) => {
      let updatedStocks = [...prev.stocks];
      let newMovements = [...prev.movements];

      if (willReserve) {
        updatedStocks = updatedStocks.map((s) => {
          if (s.variety.toLowerCase() === orderData.variety.toLowerCase()) {
            return {
              ...s,
              availableKg: Math.max(0, s.availableKg - orderData.quantityKg),
              reservedKg: s.reservedKg + orderData.quantityKg,
            };
          }
          return s;
        });

        newMovements.unshift({
          id: `mov_${Date.now()}`,
          date: orderData.orderDate,
          varietyOrItem: orderData.variety,
          quantityKg: orderData.quantityKg,
          movementType: 'order_reservation',
          relatedOrderId: id,
          reason: `Stock reserved for confirmed order ${orderNumber}`,
          recordedBy: currentUser?.name || 'Owner',
          createdAt: nowIso,
        });
      }

      // Update customer total purchases and dues
      const updatedCustomers = prev.customers.map((c) => {
        if (c.id === orderData.customerId) {
          return {
            ...c,
            totalOrders: c.totalOrders + 1,
            totalKgPurchased: c.totalKgPurchased + orderData.quantityKg,
            totalBilledAmount: c.totalBilledAmount + orderData.totalAmount,
            totalPaidAmount: c.totalPaidAmount + orderData.amountPaid,
            balanceDue: c.balanceDue + orderData.balanceDue,
          };
        }
        return c;
      });

      // If advance payment was made, log cashbook transaction
      let updatedPayments = [...prev.payments];
      if (orderData.advancePaid > 0) {
        updatedPayments.unshift({
          id: `pay_${Date.now()}`,
          transactionCode: `TXN-${new Date().getFullYear()}-${String(prev.payments.length + 1).padStart(3, '0')}`,
          date: orderData.orderDate,
          direction: 'in',
          type: 'customer_payment',
          partyName: orderData.customerName,
          relatedId: id,
          amount: orderData.advancePaid,
          paymentMethod: orderData.paymentMethod,
          notes: `Advance payment for order ${orderNumber}`,
          recordedBy: currentUser?.name || 'Owner',
          createdAt: nowIso,
        });
      }

      return {
        ...prev,
        orders: [newOrder, ...prev.orders],
        stocks: updatedStocks,
        movements: newMovements,
        customers: updatedCustomers,
        payments: updatedPayments,
      };
    });

    return { success: true };
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found' };

    const oldStatus = order.status;
    if (oldStatus === newStatus) return { success: true };

    const stock = state.stocks.find((s) => s.variety.toLowerCase() === order.variety.toLowerCase());
    const available = stock ? stock.availableKg : 0;

    const isNowReserving = ['confirmed', 'processing', 'ready_for_dispatch'].includes(newStatus);
    const wasReserved = order.stockReserved;
    const isNowDeducting = ['dispatched', 'delivered'].includes(newStatus);
    const wasDeducted = order.stockDeducted;

    // Check availability if newly reserving and wasn't already reserved
    if (isNowReserving && !wasReserved && !wasDeducted && available < order.quantityKg) {
      return {
        success: false,
        error: `Insufficient stock to confirm order. Available: ${available} kg, Required: ${order.quantityKg} kg.`,
      };
    }

    setState((prev) => {
      let updatedStocks = [...prev.stocks];
      let newMovements = [...prev.movements];
      let updatedDeliveries = [...prev.deliveries];
      const nowIso = new Date().toISOString();

      let stockReserved = order.stockReserved;
      let stockDeducted = order.stockDeducted;

      // Handle stock reservation transitions
      if (isNowReserving && !wasReserved && !wasDeducted) {
        stockReserved = true;
        updatedStocks = updatedStocks.map((s) => {
          if (s.variety.toLowerCase() === order.variety.toLowerCase()) {
            return {
              ...s,
              availableKg: Math.max(0, s.availableKg - order.quantityKg),
              reservedKg: s.reservedKg + order.quantityKg,
            };
          }
          return s;
        });
        newMovements.unshift({
          id: `mov_${Date.now()}_res`,
          date: new Date().toISOString().split('T')[0],
          varietyOrItem: order.variety,
          quantityKg: order.quantityKg,
          movementType: 'order_reservation',
          relatedOrderId: order.id,
          reason: `Reserved stock on order status changed to ${newStatus}`,
          recordedBy: currentUser?.name || 'Owner',
          createdAt: nowIso,
        });
      }

      // Handle dispatch / delivery deduction
      if (isNowDeducting && !wasDeducted) {
        stockDeducted = true;
        updatedStocks = updatedStocks.map((s) => {
          if (s.variety.toLowerCase() === order.variety.toLowerCase()) {
            const reservedToRelease = wasReserved ? order.quantityKg : 0;
            const availableToDeduct = wasReserved ? 0 : order.quantityKg;
            return {
              ...s,
              reservedKg: Math.max(0, s.reservedKg - reservedToRelease),
              availableKg: Math.max(0, s.availableKg - availableToDeduct),
              dispatchedKg: s.dispatchedKg + order.quantityKg,
              soldKg: s.soldKg + order.quantityKg,
            };
          }
          return s;
        });

        newMovements.unshift({
          id: `mov_${Date.now()}_dis`,
          date: new Date().toISOString().split('T')[0],
          varietyOrItem: order.variety,
          quantityKg: order.quantityKg,
          movementType: 'sale_dispatch',
          relatedOrderId: order.id,
          reason: `Stock dispatched/delivered for ${order.orderNumber}`,
          recordedBy: currentUser?.name || 'Owner',
          createdAt: nowIso,
        });

        // Automatically create or update linked delivery record
        const existingDelivery = prev.deliveries.find((d) => d.orderId === order.id);
        if (!existingDelivery) {
          updatedDeliveries.unshift({
            id: `del_${Date.now()}`,
            deliveryCode: `YF-DEL-${String(prev.deliveries.length + 1).padStart(3, '0')}`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            deliveryAddress: order.customerAddress,
            variety: order.variety,
            quantityToDeliverKg: order.quantityKg,
            deliveredQuantityKg: newStatus === 'delivered' ? order.quantityKg : 0,
            dispatchDate: new Date().toISOString().split('T')[0],
            expectedDeliveryDate: order.expectedDeliveryDate,
            deliveryPersonName: 'Sunil Kumar (Farm Logistics)',
            deliveryPersonPhone: '+91 98222 33445',
            transportCost: order.deliveryCharge || 0,
            status: newStatus === 'delivered' ? 'delivered' : 'in_transit',
            deliveryRemarks: `Auto-generated delivery record upon status update to ${newStatus}`,
            createdAt: nowIso,
          });
        }
      }

      // Handle cancellation release
      if (newStatus === 'cancelled') {
        if (wasReserved && !wasDeducted) {
          stockReserved = false;
          updatedStocks = updatedStocks.map((s) => {
            if (s.variety.toLowerCase() === order.variety.toLowerCase()) {
              return {
                ...s,
                reservedKg: Math.max(0, s.reservedKg - order.quantityKg),
                availableKg: s.availableKg + order.quantityKg,
              };
            }
            return s;
          });
          newMovements.unshift({
            id: `mov_${Date.now()}_can`,
            date: new Date().toISOString().split('T')[0],
            varietyOrItem: order.variety,
            quantityKg: order.quantityKg,
            movementType: 'reservation_release',
            relatedOrderId: order.id,
            reason: `Reservation released due to order cancellation (${order.orderNumber})`,
            recordedBy: currentUser?.name || 'Owner',
            createdAt: nowIso,
          });
        }
      }

      const updatedOrders = prev.orders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            stockReserved,
            stockDeducted,
            deliveredQuantityKg: newStatus === 'delivered' ? o.quantityKg : o.deliveredQuantityKg,
          };
        }
        return o;
      });

      return {
        ...prev,
        orders: updatedOrders,
        stocks: updatedStocks,
        movements: newMovements,
        deliveries: updatedDeliveries,
      };
    });

    return { success: true };
  };

  const deleteOrder = (orderId: string) => {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return;

    setState((prev) => {
      let updatedStocks = [...prev.stocks];
      // Release reservation if it was reserved and not deducted
      if (order.stockReserved && !order.stockDeducted) {
        updatedStocks = updatedStocks.map((s) => {
          if (s.variety.toLowerCase() === order.variety.toLowerCase()) {
            return {
              ...s,
              reservedKg: Math.max(0, s.reservedKg - order.quantityKg),
              availableKg: s.availableKg + order.quantityKg,
            };
          }
          return s;
        });
      }

      return {
        ...prev,
        orders: prev.orders.filter((o) => o.id !== orderId),
        deliveries: prev.deliveries.filter((d) => d.orderId !== orderId),
        stocks: updatedStocks,
      };
    });
  };

  // Deliveries
  const addDelivery = (delData: Omit<Delivery, 'id' | 'createdAt' | 'deliveryCode' | 'deliveredQuantityKg'>) => {
    const id = `del_${Date.now()}`;
    const deliveryCode = `YF-DEL-${String(state.deliveries.length + 1).padStart(3, '0')}`;
    const newDelivery: Delivery = {
      ...delData,
      id,
      deliveryCode,
      deliveredQuantityKg: 0,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      deliveries: [newDelivery, ...prev.deliveries],
    }));
  };

  const updateDeliveryStatus = (deliveryId: string, status: DeliveryStatus, deliveredQtyKg?: number, remarks?: string) => {
    setState((prev) => {
      const del = prev.deliveries.find((d) => d.id === deliveryId);
      if (!del) return prev;

      const updatedDelKg = deliveredQtyKg !== undefined ? deliveredQtyKg : status === 'delivered' ? del.quantityToDeliverKg : del.deliveredQuantityKg;

      const updatedDeliveries = prev.deliveries.map((d) => {
        if (d.id === deliveryId) {
          return {
            ...d,
            status,
            deliveredQuantityKg: updatedDelKg,
            deliveryRemarks: remarks || d.deliveryRemarks,
          };
        }
        return d;
      });

      // Update linked order if fully delivered
      const updatedOrders = prev.orders.map((o) => {
        if (o.id === del.orderId) {
          const isFullyDelivered = updatedDelKg >= o.quantityKg;
          return {
            ...o,
            deliveredQuantityKg: updatedDelKg,
            status: isFullyDelivered ? ('delivered' as const) : status === 'in_transit' ? ('dispatched' as const) : o.status,
          };
        }
        return o;
      });

      return {
        ...prev,
        deliveries: updatedDeliveries,
        orders: updatedOrders,
      };
    });
  };

  // Customers
  const addCustomer = (custData: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalKgPurchased' | 'totalBilledAmount' | 'totalPaidAmount' | 'balanceDue'>) => {
    const id = `cust_${Date.now()}`;
    const newCustomer: Customer = {
      ...custData,
      id,
      totalOrders: 0,
      totalKgPurchased: 0,
      totalBilledAmount: 0,
      totalPaidAmount: 0,
      balanceDue: 0,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      customers: [newCustomer, ...prev.customers],
    }));
  };

  const updateCustomer = (updated: Customer) => {
    setState((prev) => ({
      ...prev,
      customers: prev.customers.map((c) => (c.id === updated.id ? updated : c)),
    }));
  };

  const deleteCustomer = (id: string) => {
    setState((prev) => ({
      ...prev,
      customers: prev.customers.filter((c) => c.id !== id),
    }));
  };

  // Suppliers
  const addSupplier = (supData: Omit<Supplier, 'id' | 'createdAt' | 'totalPurchased' | 'totalPaid' | 'balancePayable'>) => {
    const id = `sup_${Date.now()}`;
    const newSupplier: Supplier = {
      ...supData,
      id,
      totalPurchased: 0,
      totalPaid: 0,
      balancePayable: 0,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      suppliers: [newSupplier, ...prev.suppliers],
    }));
  };

  const updateSupplier = (updated: Supplier) => {
    setState((prev) => ({
      ...prev,
      suppliers: prev.suppliers.map((s) => (s.id === updated.id ? updated : s)),
    }));
  };

  const deleteSupplier = (id: string) => {
    setState((prev) => ({
      ...prev,
      suppliers: prev.suppliers.filter((s) => s.id !== id),
    }));
  };

  // Payments & Cashbook
  const addPayment = (payData: Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionCode'>) => {
    const id = `pay_${Date.now()}`;
    const transactionCode = `TXN-${new Date().getFullYear()}-${String(state.payments.length + 1).padStart(3, '0')}`;
    const newPayment: PaymentTransaction = {
      ...payData,
      id,
      transactionCode,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => {
      let updatedOrders = [...prev.orders];
      let updatedCustomers = [...prev.customers];

      // If linked to an order, adjust order balance
      if (payData.relatedId && payData.direction === 'in') {
        updatedOrders = updatedOrders.map((o) => {
          if (o.id === payData.relatedId) {
            const newPaid = o.amountPaid + payData.amount;
            const newBal = Math.max(0, o.totalAmount - newPaid);
            return {
              ...o,
              amountPaid: newPaid,
              balanceDue: newBal,
            };
          }
          return o;
        });

        // Also adjust customer balance
        updatedCustomers = updatedCustomers.map((c) => {
          if (c.name.toLowerCase() === payData.partyName.toLowerCase()) {
            return {
              ...c,
              totalPaidAmount: c.totalPaidAmount + payData.amount,
              balanceDue: Math.max(0, c.balanceDue - payData.amount),
            };
          }
          return c;
        });
      }

      return {
        ...prev,
        payments: [newPayment, ...prev.payments],
        orders: updatedOrders,
        customers: updatedCustomers,
      };
    });
  };

  // Expenses
  const addExpense = (expData: Omit<Expense, 'id' | 'createdAt'>) => {
    const id = `exp_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const newExpense: Expense = {
      ...expData,
      id,
      createdAt: nowIso,
    };

    // Also register an outflow payment transaction for cashbook
    const paymentTxn: PaymentTransaction = {
      id: `pay_${Date.now()}_exp`,
      transactionCode: `TXN-EXP-${String(state.payments.length + 1).padStart(3, '0')}`,
      date: expData.date,
      direction: 'out',
      type: 'expense_payout',
      partyName: expData.recipient,
      relatedId: id,
      amount: expData.amount,
      paymentMethod: expData.paymentMethod,
      referenceNumber: expData.invoiceRef,
      notes: `${expData.category.toUpperCase()}: ${expData.description}`,
      recordedBy: expData.recordedBy,
      createdAt: nowIso,
    };

    setState((prev) => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses],
      payments: [paymentTxn, ...prev.payments],
    }));
  };

  // Stock Adjustment
  const adjustStock = (variety: MushroomVariety, newAvailableKg: number, reason: string) => {
    setState((prev) => {
      const stock = prev.stocks.find((s) => s.variety.toLowerCase() === variety.toLowerCase());
      const oldAvailable = stock ? stock.availableKg : 0;
      const diff = newAvailableKg - oldAvailable;

      const updatedStocks = prev.stocks.map((s) => {
        if (s.variety.toLowerCase() === variety.toLowerCase()) {
          return {
            ...s,
            availableKg: Math.max(0, newAvailableKg),
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return s;
      });

      const newMovement: StockMovement = {
        id: `mov_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        varietyOrItem: variety,
        quantityKg: Math.abs(diff),
        movementType: 'manual_adjustment',
        reason: `${reason} (Adjusted by ${diff >= 0 ? '+' : ''}${diff.toFixed(1)} kg)`,
        recordedBy: currentUser?.name || 'Owner',
        createdAt: new Date().toISOString(),
      };

      return {
        ...prev,
        stocks: updatedStocks,
        movements: [newMovement, ...prev.movements],
      };
    });
  };

  // Raw Materials
  const addRawMaterial = (itemData: Omit<RawMaterialItem, 'id'>) => {
    const id = `raw_${Date.now()}`;
    setState((prev) => ({
      ...prev,
      rawMaterials: [...prev.rawMaterials, { ...itemData, id }],
    }));
  };

  const updateRawMaterial = (item: RawMaterialItem) => {
    setState((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.map((r) => (r.id === item.id ? item : r)),
    }));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  };

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  };

  const clearNotifications = () => {
    setState((prev) => ({
      ...prev,
      notifications: [],
    }));
  };

  // Settings & DB Management
  const updateSettings = (partial: Partial<FarmSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...partial },
    }));
    if (partial.language) {
      setLang(partial.language);
    }
  };

  const resetToCleanData = () => {
    const clean = StorageService.resetToClean();
    setState(clean);
  };

  const loadDemoData = () => {
    const demo = StorageService.resetToDemo();
    setState(demo);
  };

  const importBackup = (jsonString: string): boolean => {
    try {
      const imported = StorageService.importJSON(jsonString);
      setState(imported);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <FarmContext.Provider
      value={{
        state,
        lang,
        t,
        setLang,
        currentUser,
        setCurrentUser,
        metrics,
        addBatch,
        updateBatch,
        deleteBatch,
        addHarvest,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        addDelivery,
        updateDeliveryStatus,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addPayment,
        addExpense,
        adjustStock,
        addRawMaterial,
        updateRawMaterial,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        updateSettings,
        resetToCleanData,
        loadDemoData,
        importBackup,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
