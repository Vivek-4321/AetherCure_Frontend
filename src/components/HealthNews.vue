<template>
    <div class="first-div">
      <h1>Health News in India</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading latest health news...</p>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchNews" class="retry-button">Retry</button>
      </div>
  
      <!-- News Content -->
      <div v-else class="first-inner-div">
        <div v-for="(article, index) in newsArticles" 
             :key="index" 
             class="news-card">
          <div class="card-upper">
            <img 
              :src="article.image || getFallbackImage(index)"
              :alt="article.title"
              @error="(e) => handleImageError(e, index)"
              class="news-image"
            >
          </div>
          <div class="card-lower">
            <div class="card-content">
              <h4>{{ truncateTitle(article.title) }}</h4>
              <p>{{ truncateDescription(article.description) }}</p>
            </div>
            <div class="card-footer">
              <p class="source">{{ article.source.name }}</p>
              <p class="date">{{ formatDate(article.publishedAt) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Load More Button -->
        <div class="load-more" v-if="hasMoreNews">
          <button @click="loadMore" :disabled="loadingMore">
            {{ loadingMore ? 'Loading...' : 'Load More News' }}
          </button>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';

const newsArticles = ref([]);
const loading = ref(true);
const error = ref(null);
const page = ref(1);
const loadingMore = ref(false);
const hasMoreNews = ref(true);

const ITEMS_PER_PAGE = 10; // Increased from 3 to 10
const API_KEY = 'e688a0dcaa2d36f07425c3461e2b6585'; // Replace with your GNews API key
const API_URL = 'https://gnews.io/api/v4/top-headlines';

// Fallback images array
const fallbackImages = [
  'https://placehold.co/600x400/e6e6e6/666666?text=Health+News',
  'https://placehold.co/600x400/f0f0f0/666666?text=Medical+Updates',
  'https://placehold.co/600x400/e9e9e9/666666?text=Healthcare'
];

const getFallbackImage = (index) => {
  return fallbackImages[index % fallbackImages.length];
};

// Fetch news data
const fetchNews = async (isLoadMore = false) => {
  if (isLoadMore) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }
  error.value = null;
  
  try {
    const params = new URLSearchParams({
      category: 'health',
      country: 'in',
      lang: 'en',
      max: ITEMS_PER_PAGE.toString(),
      page: page.value.toString(),
      apikey: API_KEY
    });

    const response = await fetch(`${API_URL}?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format: articles not found');
    }
    
    // Handle pagination
    if (isLoadMore) {
      newsArticles.value = [...newsArticles.value, ...data.articles];
    } else {
      newsArticles.value = data.articles;
    }
    
    // Check if we have more news to load
    hasMoreNews.value = data.articles.length === ITEMS_PER_PAGE;
    
  } catch (err) {
    console.error('Fetch error:', err);
    error.value = `Error loading news: ${err.message}`;
    if (!isLoadMore) {
      newsArticles.value = [];
    }
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = async () => {
  page.value++;
  await fetchNews(true);
};

const handleImageError = (event, index) => {
  event.target.src = getFallbackImage(index);
};

onMounted(fetchNews);

// Helper functions
const truncateTitle = (title) => {
  return title?.length > 60 ? title.substring(0, 60) + '...' : title;
};

const truncateDescription = (desc) => {
  return desc?.length > 100 ? desc.substring(0, 100) + '...' : desc;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
.first-div {
  width: 100%;
  min-height: 90vh;
  padding: 1rem;
}

.first-inner-div {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.news-card {
  background: var(--secondary-bg);
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-upper {
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-card:hover .news-image {
  transform: scale(1.05);
}

.card-lower {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-content {
  flex-grow: 1;
}

.card-content h4 {
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.card-content p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.card-footer p {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.load-more {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem 0;
}

.load-more button {
  padding: 0.8rem 2rem;
  background: var(--secondary-bg);
  border: 1px solid var(--text-secondary);
  border-radius: 0.5rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more button:hover:not(:disabled) {
  background: var(--text-primary);
  color: var(--secondary-bg);
}

.load-more button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .first-inner-div {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .card-content h4 {
    font-size: 1.1rem;
  }
}

/* Loading and Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--secondary-bg);
  border-top-color: var(--text-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>