export enum PurchaseRequestStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ORDERED = 'ordered',
  RECEIVED = 'received',
  CANCELLED = 'cancelled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar?: string;
}

export interface PurchaseRequestItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  supplier?: string;
  specifications?: string;
}

export interface PurchaseRequest {
  id: string;
  title: string;
  description?: string;
  requester: User;
  department: string;
  status: PurchaseRequestStatus;
  priority: Priority;
  items: PurchaseRequestItem[];
  totalAmount: number;
  requestDate: Date;
  neededByDate: Date;
  approver?: User;
  approvalDate?: Date;
  rejectionReason?: string;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseRequestFilters {
  search?: string;
  status?: PurchaseRequestStatus[];
  priority?: Priority[];
  department?: string[];
  requester?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface PurchaseRequestSorting {
  field: keyof PurchaseRequest;
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface CreatePurchaseRequestData {
  title: string;
  description?: string;
  department: string;
  priority: Priority;
  items: Omit<PurchaseRequestItem, 'id' | 'totalPrice'>[];
  neededByDate: Date;
  notes?: string;
}

export interface UpdatePurchaseRequestData extends Partial<CreatePurchaseRequestData> {
  status?: PurchaseRequestStatus;
  rejectionReason?: string;
  approver?: string;
}
