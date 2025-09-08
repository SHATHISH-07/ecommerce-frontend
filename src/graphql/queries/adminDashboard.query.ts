import { gql } from "@apollo/client";

export const GET_ADMIN_DASHBOARD_STATS = gql`
query GetAdminDashboardStats{
  getAdminDashboardStats {
    totalOrders
    totalRevenue
    cancelledOrders
    returnedOrders
    totalProducts
    totalCategories
    totalUsers
    activeUsers
    bannedUsers
    deactivatedUsers
  }
}
`;