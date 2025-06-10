// Standalone client without external dependencies
"use client"

// Initialize demo data
const initializeDemoData = () => {
  if (typeof window === "undefined") return

  // Initialize demo users if not exists
  const existingUsers = localStorage.getItem("demo_users")
  if (!existingUsers) {
    const demoUsers = [
      {
        id: "user-customer-demo-com",
        email: "customer@demo.com",
        full_name: "Demo Customer",
        user_type: "customer",
        service_type: null,
        phone: "1234567890",
        address: "123 Demo Street, Demo City",
        created_at: new Date().toISOString(),
      },
      {
        id: "user-electrician-demo-com",
        email: "electrician@demo.com",
        full_name: "Demo Electrician",
        user_type: "provider",
        service_type: "electrician",
        phone: "1234567891",
        address: "456 Service Ave, Demo City",
        created_at: new Date().toISOString(),
      },
      {
        id: "user-plumber-demo-com",
        email: "plumber@demo.com",
        full_name: "Demo Plumber",
        user_type: "provider",
        service_type: "plumber",
        phone: "1234567892",
        address: "789 Repair Rd, Demo City",
        created_at: new Date().toISOString(),
      },
      {
        id: "admin-demo",
        email: "admin@demo.com",
        full_name: "Demo Admin",
        user_type: "admin",
        created_at: new Date().toISOString(),
      },
    ]
    localStorage.setItem("demo_users", JSON.stringify(demoUsers))
  }

  // Initialize demo service requests if not exists
  const existingRequests = localStorage.getItem("demo_service_requests")
  if (!existingRequests) {
    const demoRequests = [
      {
        id: "req-1",
        customer_id: "user-customer-demo-com",
        service_type: "electrician",
        problem_description: "Power outage in my apartment. Need urgent help!",
        preferred_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        preferred_time: "10:00 AM",
        customer_address: "123 Demo Street, Apt 4B, Demo City",
        status: "pending",
        created_at: new Date().toISOString(),
      },
      {
        id: "req-2",
        customer_id: "user-customer-demo-com",
        service_type: "electrician",
        problem_description: "Need to install new ceiling fan in living room",
        preferred_date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        preferred_time: "2:00 PM",
        customer_address: "123 Demo Street, Apt 4B, Demo City",
        status: "payment_pending",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "req-3",
        customer_id: "user-customer-demo-com",
        service_type: "electrician",
        problem_description: "Short circuit in kitchen, sparks coming from outlet",
        preferred_date: new Date(Date.now() + 259200000).toISOString().split("T")[0],
        preferred_time: "11:30 AM",
        customer_address: "123 Demo Street, Apt 4B, Demo City",
        status: "in_progress",
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ]
    localStorage.setItem("demo_service_requests", JSON.stringify(demoRequests))
  }
}

// Standalone database client
const createStandaloneClient = () => {
  // Initialize demo data
  initializeDemoData()

  return {
    auth: {
      signUp: async ({ email, password }: { email: string; password: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newUser = {
          id: `user-${email.replace(/[^a-zA-Z0-9]/g, "-")}`,
          email,
          created_at: new Date().toISOString(),
        }

        if (typeof window !== "undefined") {
          const existingUsers = JSON.parse(localStorage.getItem("demo_users") || "[]")
          const userExists = existingUsers.find((u: any) => u.email === email)

          if (userExists) {
            return {
              data: { user: null },
              error: { message: "User already registered" },
            }
          }

          localStorage.setItem("current_user", JSON.stringify(newUser))
        }

        return {
          data: { user: newUser, session: { access_token: "demo-token" } },
          error: null,
        }
      },

      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (!email || !password) {
          return {
            data: { user: null },
            error: { message: "Email and password are required" },
          }
        }

        if (password.length < 6) {
          return {
            data: { user: null },
            error: { message: "Password must be at least 6 characters long" },
          }
        }

        if (typeof window !== "undefined") {
          const existingUsers = JSON.parse(localStorage.getItem("demo_users") || "[]")
          const user = existingUsers.find((u: any) => u.email === email)

          if (!user) {
            return {
              data: { user: null },
              error: { message: "Invalid login credentials" },
            }
          }

          const mockUser = {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
          }

          localStorage.setItem("current_user", JSON.stringify(mockUser))

          return {
            data: { user: mockUser, session: { access_token: "demo-token" } },
            error: null,
          }
        }

        return {
          data: { user: null },
          error: { message: "Login failed" },
        }
      },

      getUser: async () => {
        if (typeof window !== "undefined") {
          const currentUser = localStorage.getItem("current_user")
          if (currentUser) {
            const user = JSON.parse(currentUser)
            return {
              data: { user: { id: user.id, email: user.email } },
              error: null,
            }
          }
        }
        return { data: { user: null }, error: null }
      },

      signOut: async () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("current_user")
        }
        return { error: null }
      },

      onAuthStateChange: (callback: any) => {
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
    },

    from: (table: string) => {
      const queryBuilder = {
        filters: { equals: {} as Record<string, any>, in: {} as Record<string, any[]> },
        joinRelations: {} as Record<string, string>,
        orderBy: { column: "", ascending: false },

        select: (columns: string) => {
          if (columns.includes("(")) {
            const regex = /(\w+):(\w+)\s*\(/g
            let match
            while ((match = regex.exec(columns)) !== null) {
              const [, alias, foreignKey] = match
              queryBuilder.joinRelations[alias] = foreignKey
            }
          }
          return queryBuilder
        },

        eq: (column: string, value: any) => {
          queryBuilder.filters.equals[column] = value
          return queryBuilder
        },

        in: (column: string, values: any[]) => {
          queryBuilder.filters.in[column] = values
          return queryBuilder
        },

        order: (column: string, options: { ascending: boolean }) => {
          queryBuilder.orderBy = { column, ascending: options.ascending }
          return queryBuilder
        },

        insert: async (data: any) => {
          if (typeof window === "undefined") {
            return { data: { id: data.id || `mock-${Date.now()}` }, error: null }
          }

          if (table === "users") {
            const existingUsers = JSON.parse(localStorage.getItem("demo_users") || "[]")
            existingUsers.push(data)
            localStorage.setItem("demo_users", JSON.stringify(existingUsers))
          }

          if (table === "service_requests") {
            const existingRequests = JSON.parse(localStorage.getItem("demo_service_requests") || "[]")
            const newRequest = {
              ...data,
              id: data.id || `req-${Date.now()}`,
              created_at: data.created_at || new Date().toISOString(),
            }
            existingRequests.push(newRequest)
            localStorage.setItem("demo_service_requests", JSON.stringify(existingRequests))
          }

          return { data: { id: data.id || `mock-${Date.now()}` }, error: null }
        },

        update: (data: any) => ({
          eq: (column: string, value: any) => ({
            then: async (callback: any) => {
              if (typeof window !== "undefined") {
                if (table === "service_requests") {
                  const requests = JSON.parse(localStorage.getItem("demo_service_requests") || "[]")
                  const updatedRequests = requests.map((req: any) => {
                    if (req[column] === value) {
                      return { ...req, ...data }
                    }
                    return req
                  })
                  localStorage.setItem("demo_service_requests", JSON.stringify(updatedRequests))
                }

                if (table === "users") {
                  const users = JSON.parse(localStorage.getItem("demo_users") || "[]")
                  const updatedUsers = users.map((user: any) => {
                    if (user[column] === value) {
                      return { ...user, ...data }
                    }
                    return user
                  })
                  localStorage.setItem("demo_users", JSON.stringify(updatedUsers))
                }
              }

              return callback({ data: null, error: null })
            },
          }),
        }),

        single: async () => {
          if (typeof window === "undefined") {
            return { data: null, error: null }
          }

          if (table === "users") {
            const existingUsers = JSON.parse(localStorage.getItem("demo_users") || "[]")
            const result = existingUsers.filter((item: any) => {
              for (const [key, value] of Object.entries(queryBuilder.filters.equals)) {
                if (item[key] !== value) return false
              }
              return true
            })

            if (result.length > 0) {
              return { data: result[0], error: null }
            }

            if (queryBuilder.filters.equals.id?.startsWith("admin-")) {
              return {
                data: {
                  id: queryBuilder.filters.equals.id,
                  full_name: "Demo Admin",
                  user_type: "admin",
                  email: "admin@demo.com",
                  created_at: new Date().toISOString(),
                },
                error: null,
              }
            }

            return { data: null, error: { message: "User not found" } }
          }

          return { data: null, error: { message: "No data found" } }
        },

        then: async (callback: any) => {
          if (typeof window === "undefined") {
            return callback({ data: [], error: null })
          }

          if (table === "service_requests") {
            const requests = JSON.parse(localStorage.getItem("demo_service_requests") || "[]")
            const users = JSON.parse(localStorage.getItem("demo_users") || "[]")

            let result = requests.filter((item: any) => {
              for (const [key, value] of Object.entries(queryBuilder.filters.equals)) {
                if (item[key] !== value) return false
              }
              for (const [key, values] of Object.entries(queryBuilder.filters.in)) {
                if (!values.includes(item[key])) return false
              }
              return true
            })

            if (queryBuilder.joinRelations.users) {
              result = result.map((request: any) => {
                const customer = users.find((user: any) => user.id === request.customer_id)
                return {
                  ...request,
                  users: customer
                    ? {
                        full_name: customer.full_name,
                        phone: customer.phone,
                        email: customer.email,
                      }
                    : {
                        full_name: "Unknown Customer",
                        phone: "Not provided",
                        email: "Not provided",
                      },
                }
              })
            }

            if (queryBuilder.orderBy.column) {
              result.sort((a: any, b: any) => {
                if (queryBuilder.orderBy.ascending) {
                  return a[queryBuilder.orderBy.column] > b[queryBuilder.orderBy.column] ? 1 : -1
                } else {
                  return a[queryBuilder.orderBy.column] < b[queryBuilder.orderBy.column] ? 1 : -1
                }
              })
            }

            return callback({ data: result, error: null })
          }

          if (table === "users") {
            const users = JSON.parse(localStorage.getItem("demo_users") || "[]")
            const result = users.filter((item: any) => {
              for (const [key, value] of Object.entries(queryBuilder.filters.equals)) {
                if (item[key] !== value) return false
              }
              for (const [key, values] of Object.entries(queryBuilder.filters.in)) {
                if (!values.includes(item[key])) return false
              }
              return true
            })

            return callback({ data: result, error: null })
          }

          return callback({ data: [], error: null })
        },
      }

      return queryBuilder
    },

    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => ({
          data: { path },
          error: null,
        }),
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `/placeholder.svg?height=200&width=300` },
        }),
      }),
    },
  }
}

// Export the standalone client
export const supabase = createStandaloneClient()
export const createClient = () => createStandaloneClient()
export const createServerClient = () => createStandaloneClient()
