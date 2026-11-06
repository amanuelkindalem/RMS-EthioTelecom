// Initial seed and offline cache for EthioTelecom RMS

export const INITIAL_BRANCHES = [
  { id: 'b1', name: 'Addis Ababa Central Branch', code: 'AAC-01', region: 'Addis Ababa', zone: 'Central', woreda: 'Kirkos', kebele: '02' },
  { id: 'b2', name: 'Bole District Office', code: 'AA-BOL-04', region: 'Addis Ababa', zone: 'East', woreda: 'Bole', kebele: '07' },
  { id: 'b3', name: 'Hawassa Regional Hub', code: 'SNNP-HW-01', region: 'Sidama', zone: 'Hawassa', woreda: 'Menaheria', kebele: '03' },
];

export const INITIAL_VEHICLES = [
  { id: 'v1', vehicleCode: 'ET-3-45812', type: 'Toyota Hilux 4x4 (Telecom Maintenance)', capacityLiters: 80, standardConsumption: 0.12, branchId: 'b1' },
  { id: 'v2', vehicleCode: 'ET-3-89201', type: 'Isuzu NPR Truck (Fiber Optic Team)', capacityLiters: 150, standardConsumption: 0.22, branchId: 'b1' },
  { id: 'v3', vehicleCode: 'ET-3-11029', type: 'Toyota Land Cruiser (Network Field Support)', capacityLiters: 90, standardConsumption: 0.14, branchId: 'b2' },
  { id: 'v4', vehicleCode: 'ET-3-33948', type: 'Nissan Patrol (Tower Maintenance)', capacityLiters: 95, standardConsumption: 0.15, branchId: 'b3' },
];

export const INITIAL_USERS = [
  { id: 'u-hq-1', fullName: 'Dawit Mengistu', email: 'dawit.hq@ethiotelecom.et', role: 'HQ_ADMIN', branchId: null, employeeId: 'ET-HQ-001', phoneNumber: '+251 911 234567', isActive: true },
  { id: 'u-ba-1', fullName: 'Almaz Tadesse', email: 'almaz.bole@ethiotelecom.et', role: 'BRANCH_ADMIN', branchId: 'b1', employeeId: 'ET-BA-104', phoneNumber: '+251 922 456789', isActive: true },
  { id: 'u-rt-1', fullName: 'Kenenisa Bekele', email: 'kenenisa.refuel@ethiotelecom.et', role: 'REFUELING_TEAM', branchId: 'b1', employeeId: 'ET-RT-209', phoneNumber: '+251 933 678901', isActive: true },
  { id: 'u-rm-1', fullName: 'Sara Haile', email: 'sara.manager@ethiotelecom.et', role: 'REFUELING_MANAGER', branchId: 'b1', employeeId: 'ET-RM-301', phoneNumber: '+251 944 890123', isActive: true },
  { id: 'u-fn-1', fullName: 'Yared Getachew', email: 'yared.finance@ethiotelecom.et', role: 'FINANCE', branchId: 'b1', employeeId: 'ET-FN-402', phoneNumber: '+251 912 345678', isActive: true },
  { id: 'u-fa-1', fullName: 'Birtukan Mamo', email: 'birtukan.fleet@ethiotelecom.et', role: 'FUEL_ADMIN', branchId: 'b1', employeeId: 'ET-FA-505', phoneNumber: '+251 915 678902', isActive: true },
  { id: 'u-dr-1', fullName: 'Tewodros Kassaye', email: 'tewodros.driver@ethiotelecom.et', role: 'DRIVER', branchId: 'b1', employeeId: 'ET-DR-601', phoneNumber: '+251 918 901234', isActive: true },
];

export const INITIAL_SESSIONS = [
  {
    id: 'fs-101',
    branchId: 'b1',
    vehicleId: 'v1',
    driverId: 'u-dr-1',
    erpTaskRef: 'ERD-TASK-2025-8841',
    status: 'OPEN',
    openedById: 'u-rt-1',
    openedAt: '2026-11-06T06:30:00Z',
    vehicle: INITIAL_VEHICLES[0],
    driver: INITIAL_USERS[6],
    branch: INITIAL_BRANCHES[0],
    initialState: {
      odometerStart: 124500,
      fuelLevelStart: 65,
      recordedAt: '2026-11-06T06:35:00Z',
    },
    metadata: {
      departure: 'HQ Central Depot',
      destination: 'Bole Tower Sites 4 & 7',
      department: 'Mobile Infrastructure',
      description: 'Fiber cable splice inspection & generator diesel top-up check',
      timeOut: '2026-11-06T07:00:00Z',
    },
    fuelRequests: [
      {
        id: 'fr-201',
        fuelSessionId: 'fs-101',
        requestedById: 'u-dr-1',
        requestedAmount: 40,
        approvedAmount: 40,
        status: 'APPROVED',
        managerComment: 'Approved as per route distance requirement',
        createdAt: '2026-11-06T08:15:00Z',
        transaction: {
          id: 'ft-301',
          fuelRequestId: 'fr-201',
          amount: 40,
          paymentMethod: 'Telebirr Business Fuel Voucher',
          reference: 'TX-ET-994821',
          paidAt: '2026-11-06T08:30:00Z',
        },
      },
    ],
  },
  {
    id: 'fs-102',
    branchId: 'b1',
    vehicleId: 'v2',
    driverId: 'u-dr-1',
    erpTaskRef: 'ERD-TASK-2025-7731',
    status: 'CLOSED',
    openedById: 'u-rt-1',
    openedAt: '2026-11-05T08:00:00Z',
    closedAt: '2026-11-05T17:30:00Z',
    vehicle: INITIAL_VEHICLES[1],
    driver: INITIAL_USERS[6],
    branch: INITIAL_BRANCHES[0],
    initialState: {
      odometerStart: 88200,
      fuelLevelStart: 120,
      recordedAt: '2026-11-05T08:10:00Z',
    },
    finalState: {
      odometerEnd: 88520, // 320 km
      fuelLevelEnd: 35,   // consumed 85 L
      recordedAt: '2026-11-05T17:25:00Z',
    },
    analysis: {
      distance: 320,
      expectedConsumption: 70.4, // 320 * 0.22 L/km
      actualConsumption: 85,
      variance: 14.6, // Discrepancy > 10%
      flagged: true,
    },
    fraudCase: {
      id: 'fc-401',
      reason: 'Fuel consumption variance of +14.6 L exceeds allowed 10% threshold for vehicle ET-3-89201',
      resolved: false,
      resolutionNote: null,
      createdAt: '2026-11-05T17:30:00Z',
    },
  },
];

