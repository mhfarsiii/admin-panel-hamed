<template>
  <div class="list-category">
    <!-- Header with toggle button -->
    <div class="header">
      <h2>Categories</h2>
      <button @click="toggleView" class="toggle-btn">
        <span v-if="isTableView">📋</span>
        <span v-else>📊</span>
        {{ isTableView ? 'Card View' : 'Table View' }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="panelStore.isLoading" class="loading">
      Loading categories...
    </div>

    <!-- Error message -->
    <div v-if="panelStore.message && !panelStore.success" class="error">
      {{ panelStore.message }}
    </div>

    <!-- Table View -->
    <div v-if="isTableView && !panelStore.isLoading" class="table-container">
      <table class="category-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in panelStore.categories" :key="category.id">
            <td class="image-cell">
              <img v-if="category.imageUrl" :src="`http://api.hamedaei.com${category.imageUrl}`" :alt="category.title"
                class="category-image" />
              <div v-else class="no-image">No Image</div>
            </td>
            <td>{{ category.title }}</td>
            <td>{{ category.description }}</td>
            <td>{{ formatDate(category.createdAt) }}</td>
            <td class="actions">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card View -->
    <div v-if="!isTableView && !panelStore.isLoading" class="card-container">
      <div class="cards-grid">
        <div v-for="category in panelStore.categories" :key="category.id" class="category-card">
          <div class="card-image">
            <img v-if="category.imageUrl" :src="`http://api.hamedaei.com${category.imageUrl}`" :alt="category.title" />
            <div v-else class="no-image-placeholder">
              <span>📷</span>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ category.title }}</h3>
            <p class="card-description">{{ category.description }}</p>
            <div class="card-meta">
              <span class="created-date">{{ formatDate(category.createdAt) }}</span>
            </div>
            <div class="card-actions">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!panelStore.isLoading && panelStore.categories.length === 0" class="empty-state">
      <p>No categories found. Create your first category!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePanelStore } from '@/stores/panel'

const panelStore = usePanelStore()
const isTableView = ref(true)

const toggleView = () => {
  isTableView.value = !isTableView.value
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}



onMounted(() => {
  panelStore.fetchCategories()
})
</script>

<style scoped>
.list-category {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e5e7eb;
}

.header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background: #2563eb;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 16px;
}

.error {
  background: #fef2f2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #fecaca;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.category-table {
  width: 100%;
  border-collapse: collapse;
}

.category-table th {

  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.category-table td {
  padding: 16px 12px;

  vertical-align: middle;
}

.image-cell {
  width: 80px;
}

.category-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.no-image {
  width: 60px;
  height: 60px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.edit-btn {
  background: #10b981;
  color: white;
}

.edit-btn:hover {
  background: #059669;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

/* Card Styles */
.card-container {
  margin-top: 20px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.category-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-image {
  height: 200px;
  overflow: hidden;
  background: #f8fafc;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  font-size: 48px;
  color: #9ca3af;
}

.card-content {
  padding: 20px;
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.card-description {
  margin: 0 0 16px 0;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  margin-bottom: 16px;
}

.created-date {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .category-table th,
  .category-table td {
    padding: 12px 8px;
    font-size: 14px;
  }

  .actions {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
