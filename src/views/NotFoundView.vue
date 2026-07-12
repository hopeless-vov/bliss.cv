<script setup lang="ts">
import BlueScreen from '@/components/ui/BlueScreen.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const technical = computed(() => [
  t('notFound.tech1'),
  t('notFound.tech2'),
  t('notFound.tech3'),
])

// Both "power" buttons recover the same way — back to the booting desktop.
function goHome(): void {
  void router.push('/')
}
</script>

<template>
  <BlueScreen
    :code="t('notFound.code')"
    :intro="t('notFound.intro')"
    :error-id="t('notFound.errorId')"
    :advice="t('notFound.advice')"
    :steps="t('notFound.steps')"
    :technical="technical"
    :restart-label="t('notFound.restart')"
    :turn-off-label="t('notFound.turnOff')"
    :hint="t('notFound.hint')"
    @restart="goHome"
    @turn-off="goHome"
  />
</template>
