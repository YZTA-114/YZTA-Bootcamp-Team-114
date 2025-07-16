<template>
  <ul class="dashboard-nav">
    <li v-for="item in navItems" :key="item.id" class="nav-item">
      <router-link 
        :to="item.path" 
        class="nav-link"
        :class="{ 'active': isActive(item.path) }"
        v-if="!item.children"
      >
        <component :is="item.icon" class="nav-icon" />
        <span class="nav-text" v-if="!collapsed">{{ item.label }}</span>
        <span class="nav-badge" v-if="item.badge && !collapsed">{{ item.badge }}</span>
      </router-link>
      
      <div v-else class="nav-group">
        <button 
          class="nav-link nav-toggle"
          :class="{ 'active': isGroupActive(item.children) }"
          @click="toggleGroup(item.id)"
        >
          <component :is="item.icon" class="nav-icon" />
          <span class="nav-text" v-if="!collapsed">{{ item.label }}</span>
          <ri-arrow-down-s-line 
            class="nav-arrow" 
            :class="{ 'rotated': openGroups.includes(item.id) }"
            v-if="!collapsed"
          />
        </button>
        
        <ul class="nav-submenu" v-if="openGroups.includes(item.id) && !collapsed">
          <li v-for="child in item.children" :key="child.id" class="nav-subitem">
            <router-link 
              :to="child.path" 
              class="nav-sublink"
              :class="{ 'active': isActive(child.path) }"
            >
              <component :is="child.icon" class="nav-subicon" />
              <span class="nav-subtext">{{ child.label }}</span>
              <span class="nav-badge" v-if="child.badge">{{ child.badge }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useRoute } from 'vue-router'

// Props
defineProps({
  navItems: {
    type: Array,
    required: true
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

// Route
const route = useRoute()

// Reactive data
const openGroups = ref([])

// Computed
const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const isGroupActive = (children) => {
  return children.some(child => isActive(child.path))
}

// Methods
const toggleGroup = (groupId) => {
  const index = openGroups.value.indexOf(groupId)
  if (index > -1) {
    openGroups.value.splice(index, 1)
  } else {
    openGroups.value.push(groupId)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/custom/_variable.scss';

.dashboard-nav {
  list-style: none;
  margin: 0;
  padding: 0;

  .nav-item {
    margin: 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: $space-s;
    padding: $space-s $space-m;
    color: rgba($white, 0.8);
    text-decoration: none;
    font-size: $font-size-s;
    font-weight: $font-weight-regular;
    transition: all 0.2s ease;
    border-radius: 0;
    position: relative;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      color: $white;
      background-color: rgba($white, 0.1);
    }

    &.active {
      color: $white;
      background-color: rgba($white, 0.15);
      font-weight: $font-weight-semi-bold;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background-color: $yellow;
      }
    }

    .nav-icon {
      width: 20px;
      text-align: center;
      flex-shrink: 0;
    }

    .nav-text {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: $font-family-primary-regular;
    }

    .nav-badge {
      background-color: $orange;
      color: $white;
      font-size: $font-size-xxs;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
      font-weight: $font-weight-semi-bold;
    }

    .nav-arrow {
      transition: transform 0.2s ease;

      &.rotated {
        transform: rotate(180deg);
      }
    }
  }

  .nav-group {
    .nav-toggle {
      justify-content: space-between;
    }

    .nav-submenu {
      list-style: none;
      margin: 0;
      padding: 0;
      background-color: rgba($black, 0.1);

      .nav-subitem {
        margin: 0;
      }

      .nav-sublink {
        padding: $space-xs $space-m $space-xs calc($space-m + 20px);
        font-size: $font-size-xs;
        color: rgba($white, 0.7);

        &:hover {
          color: $white;
          background-color: rgba($white, 0.05);
        }

        &.active {
          color: $white;
          background-color: rgba($white, 0.1);
          font-weight: $font-weight-semi-bold;
        }

        .nav-subicon {
          width: 16px;
          text-align: center;
          flex-shrink: 0;
        }

        .nav-subtext {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

// Collapsed state styles
.dashboard-nav {
  .nav-link {
    &.collapsed {
      justify-content: center;
      padding: $space-s;

      .nav-icon {
        margin: 0;
      }

      .nav-text,
      .nav-badge,
      .nav-arrow {
        display: none;
      }
    }
  }
}
</style> 