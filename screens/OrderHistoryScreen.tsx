import { useState, useEffect } from 'react'
import {
  View, Text, FlatList,
  TouchableOpacity, StyleSheet
} from 'react-native'
import { supabase } from '../lib/supabase'
import { palette } from '../lib/theme'

export default function OrderHistoryScreen({ navigation }: any) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 5

  useEffect(() => {
    getOrders(0)
  }, [])

  async function getOrders(pageNum: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from('orders')
      .select()
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) console.log(error)

    if (data) {
      if (pageNum === 0) {
        setOrders(data)
      } else {
        setOrders((prev) => [...prev, ...data])
      }
      setHasMore(data.length === PAGE_SIZE)
    }

    setLoading(false)
  }

  function loadMore() {
    const nextPage = page + 1
    setPage(nextPage)
    getOrders(nextPage)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending': return palette.rosyBrown
      case 'confirmed': return palette.darkGreen
      case 'delivered': return palette.midnightGreen
      case 'cancelled': return palette.rosyBrown
      default: return palette.mossGreen
    }
  }

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading orders... ⏳</Text>
      </View>
    )
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No orders yet! 📋</Text>
        <Text style={styles.emptySubText}>Place your first order! 🍵</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Order History 📋</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>

            {/* Order ID + Date */}
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <Text style={styles.date}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>

            {/* Items */}
            {item.items.map((product: any, index: number) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {product.name} x{product.quantity}
                </Text>
                <Text style={styles.itemPrice}>
                  ${(product.price * product.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            {/* Total + Status */}
            <View style={styles.cardFooter}>
              <Text style={styles.total}>
                Total: ${item.total.toFixed(2)}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) }
              ]}>
                <Text style={styles.statusText}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>

          </View>
        )}
        ListFooterComponent={
          hasMore ? (
            <TouchableOpacity
              style={styles.loadMoreBtn}
              onPress={loadMore}
            >
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noMoreText}>No more orders</Text>
          )
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.beige,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: palette.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: palette.darkGreen,
  },
  emptySubText: {
    fontSize: 16,
    color: palette.mossGreen,
    marginTop: 8,
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    fontSize: 16,
    color: palette.darkGreen,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: palette.darkGreen,
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: palette.mossGreen,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: palette.mossGreen,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.midnightGreen,
  },
  date: {
    fontSize: 13,
    color: palette.mossGreen,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    color: palette.midnightGreen,
  },
  itemPrice: {
    fontSize: 14,
    color: palette.darkGreen,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: palette.mossGreen,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.midnightGreen,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadMoreBtn: {
    backgroundColor: palette.darkGreen,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loadMoreText: {
    color: palette.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  noMoreText: {
    textAlign: 'center',
    color: palette.mossGreen,
    marginBottom: 20,
    fontSize: 14,
  },
})