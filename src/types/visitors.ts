
export type VisitorType = "regular" | "service";

export interface Visitor {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  checkInTime?: string;
  hostName?: string;
  company?: string;
  type?: VisitorType;
}

export interface Host {
  id: number;
  name: string;
  department: string;
}
