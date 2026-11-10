export type MushroomVariety = 'Oyster' | 'Button' | 'Milky' | 'Shiitake' | 'Paddy Straw' | string;

export type BatchStatus = 'inoculation' | 'spawn_run' | 'pinheading' | 'harvesting' | 'completed' | 'cancelled';

export type QualityGrade = 'Grade A (Premium)' | 'Grade B (Standard)' | 'Grade C (Processing)';

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'processing'
  | 'ready_for_dispatch'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type DeliveryStatus = 'scheduled' | 'in_transit' | 'delivered' | 'failed' | 'partial';

export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'cheque';

export type ExpenseCategory =
  | 'spawn'
  | 'substrate_straw'
  | 'labour'
  | 'electricity_water'
  | 'packaging'
  | 'transport'
  | 'rent'
  | 'equipment_maintenance'
  | 'spoilage'
  | 'miscellaneous';

export type CustomerType = 'retail' | 'wholesale' | 'hotel' | 'mandi_trader';

export type UserRole = 'owner' | 'manager' | 'worker';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  pin: string;
  lastLogin?: string;
}

export interface ProductionBatch {
  id: string;
  batchCode: string;
  startDate: string;
  variety: MushroomVariety;
  bagCount: number;
  roomNumber: string;
  spawnQtyKg: number;
  spawnCost: number;
  substrateType: string;
  substrateQtyKg: number;
  substrateCost: number;
  labourCost: number;
  electricityWaterCost: number;
  packagingCost: number;
  otherCosts: number;
  totalCost: number;
  targetHarvestDate: string;
  status: BatchStatus;
  totalHarvestedKg: number;
  notes?: string;
  createdAt: string;
}

export interface HarvestRecord {
  id: string;
  batchId: string;
  batchCode: string;
  harvestDate: string;
  variety: MushroomVariety;
  flushNumber: number; // 1, 2, 3
  grossQtyKg: number;
  gradeA_QtyKg: number;
  gradeB_QtyKg: number;
  gradeC_QtyKg: number;
  spoiledQtyKg: number;
  netFreshQtyKg: number;
  harvestedBy: string;
  notes?: string;
  createdAt: string;
}

export interface MushroomStock {
  variety: MushroomVariety;
  totalHarvestedKg: number;
  soldKg: number;
  reservedKg: number;
  dispatchedKg: number;
  spoiledKg: number;
  availableKg: number;
  lowStockThresholdKg: number;
  lastUpdated: string;
}

export interface RawMaterialItem {
  id: string;
  name: string;
  category: 'spawn' | 'substrate' | 'packaging' | 'chemical' | 'other';
  unit: 'kg' | 'pieces' | 'litres' | 'bags';
  currentQty: number;
  minThreshold: number;
  costPerUnit: number;
  supplierName?: string;
  lastRestockedDate?: string;
}

export interface StockMovement {
  id: string;
  date: string;
  varietyOrItem: string;
  quantityKg: number;
  movementType: 'harvest_in' | 'sale_dispatch' | 'order_reservation' | 'reservation_release' | 'spoilage_out' | 'manual_adjustment';
  relatedOrderId?: string;
  relatedBatchId?: string;
  reason: string;
  recordedBy: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. YF-ORD-2026-001
  orderDate: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  variety: MushroomVariety;
  quantityKg: number;
  pricePerKg: number;
  discountAmount: number;
  deliveryCharge: number;
  totalAmount: number;
  advancePaid: number;
  amountPaid: number;
  balanceDue: number;
  expectedDeliveryDate: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  deliveredQuantityKg: number;
  stockReserved: boolean;
  stockDeducted: boolean;
  notes?: string;
  createdAt: string;
}

export interface Delivery {
  id: string;
  deliveryCode: string; // e.g. YF-DEL-001
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  variety: MushroomVariety;
  quantityToDeliverKg: number;
  deliveredQuantityKg: number;
  dispatchDate: string;
  expectedDeliveryDate: string;
  deliveryPersonName: string;
  deliveryPersonPhone: string;
  transportCost: number;
  vehicleNumber?: string;
  status: DeliveryStatus;
  deliveryRemarks?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  type: CustomerType;
  gstNumber?: string;
  totalOrders: number;
  totalKgPurchased: number;
  totalBilledAmount: number;
  totalPaidAmount: number;
  balanceDue: number;
  createdAt: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  supplyCategory: string;
  totalPurchased: number;
  totalPaid: number;
  balancePayable: number;
  createdAt: string;
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionCode: string;
  date: string;
  direction: 'in' | 'out'; // in = customer cash inflow, out = expense/supplier payout
  type: 'customer_payment' | 'supplier_payment' | 'expense_payout' | 'customer_refund' | 'direct_sale';
  partyName: string;
  relatedId?: string; // orderId, customerId, supplierId, expenseId
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  recipient: string;
  description: string;
  invoiceRef?: string;
  recordedBy: string;
  createdAt: string;
}

export interface NotificationAlert {
  id: string;
  type: 'order_pending' | 'delivery_due' | 'delivery_overdue' | 'low_stock' | 'harvest_upcoming' | 'payment_due' | 'spoilage_alert';
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  isRead: boolean;
  linkPage?: string;
}

export interface FarmSettings {
  farmName: string;
  farmNameHi: string;
  ownerName: string;
  ownerNameHi: string;
  phone: string;
  email: string;
  address: string;
  fssaiNumber?: string;
  gstin?: string;
  currencySymbol: string;
  language: 'en' | 'hi';
  defaultOysterPrice: number;
  defaultButtonPrice: number;
  defaultMilkyPrice: number;
  defaultShiitakePrice: number;
  defaultPaddyStrawPrice: number;
  lowStockThresholdKg: number;
  autoReserveOnConfirm: boolean;
}

export interface DatabaseState {
  users: User[];
  currentUser: User | null;
  settings: FarmSettings;
  batches: ProductionBatch[];
  harvests: HarvestRecord[];
  stocks: MushroomStock[];
  rawMaterials: RawMaterialItem[];
  movements: StockMovement[];
  customers: Customer[];
  suppliers: Supplier[];
  orders: Order[];
  deliveries: Delivery[];
  expenses: Expense[];
  payments: PaymentTransaction[];
  notifications: NotificationAlert[];
  version: number;
  isDemoData: boolean;
}
