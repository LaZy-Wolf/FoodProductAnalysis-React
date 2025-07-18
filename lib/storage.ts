export async function saveScannedProduct(product: any) {
  try {
    const existingProducts = await getScannedProducts()
    const updatedProducts = [product, ...existingProducts.slice(0, 49)] // Keep last 50 products
    localStorage.setItem("scannedProducts", JSON.stringify(updatedProducts))
  } catch (error) {
    console.error("Error saving product:", error)
  }
}

export async function getScannedProducts(): Promise<any[]> {
  try {
    const products = localStorage.getItem("scannedProducts")
    return products ? JSON.parse(products) : []
  } catch (error) {
    console.error("Error getting products:", error)
    return []
  }
}

export async function clearScannedProducts() {
  try {
    localStorage.removeItem("scannedProducts")
  } catch (error) {
    console.error("Error clearing products:", error)
  }
}
