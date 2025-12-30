
<template>
  <Transition name="modal-fade">
    <div
      v-if="modelValue"
      class="fixed inset-0   bg-black/50   flex items-center justify-center z-[999]   transition-all duration-700"
      @click="handleOverlayClick"
      @touchmove.stop
      @wheel.stop
    >
      <div
        class="bg-[#ffffff] rounded-3xl shadow-md  overflow-x-hidden w-full mx-4 max-h-[750px]"
        :class="[
          size === 'sm' ? 'max-w-sm' :
          size === 'md' ? 'max-w-md' :
          size === 'lg' ? 'max-w-lg' :
          size === 'xl' ? 'max-w-[950px]' :
          'max-w-full'
        ]"
        @click.stop
        role="dialog"
        aria-modal="true"
      >
        <!-- Header -->
        <slot name="icon"/>
        <div v-if="$slots.header || title" class="px-6 pt-4">
          <slot name="header">
            <h3 class="text-[20px] leading-[34px] text-font-dark font-ExtraBold">{{ title }}</h3>
          </slot>
        </div>

        <div class="px-6">
            <slot name="body"/>
          </div>

        <!-- Body -->
        <div class="px-4 py-2">
          <slot name="body-top" />

          <div v-if="showInput" class="space-y-4">
            <label v-if="inputLabel" :for="inputId" class="block text-sm font-medium text-gray-700">
              {{ inputLabel }}
            </label>

            <div class="relative">
              <form @submit.prevent="submitHandler" class="space-y-4">
               <div class="flex flex-col gap-1">
                <input
                ref="inputRef"
                  :id="inputId"
                  v-model="inputValue"
                  :type="inputType"
                  :placeholder="placeholder"
                  :maxlength="maxLength"
                  :disabled="disabled"
                  :class="[
                    'w-full px-4 bg-gray-100 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    showError ? 'border-red-500' : 'border-gray-300',

                  ]"
                  @input="handleInput"
                />
                <!-- Error message  -->
                <div v-if="showError && errorMessage" class="text-red-500 text-[12px] text-right  px-2">
                  {{ errorMessage }}
                </div>
               </div>

              </form>
            </div>
          </div>
          <div v-if="isShowDeleteItem" class="flex flex-nowrap gap-3 mt-3 pb-3" dir="rtl" >
            <button variant="red" class-name="flex-1" :is-circle="true" :is-icon-only="false" @click="deleteHandler" :is-loading="isLoading">
            no
            </button>
            <button variant="outlines" class-name="flex-1" :is-circle="true" :is-icon-only="false" @click="closeModal">
              yes
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch,onMounted } from 'vue'


// import { useScrollLock } from '@/composables/useLockScroll'

interface Props extends BaseModalProps {
  showInput?: boolean
  inputLabel?: string
  inputType?: string
  placeholder?: string
  maxLength?: number
  showCharCount?: boolean
  displayText?: string
  disabled?: boolean
  errorMessage?: string
  showError?: boolean
  defaultValue?: string
  isShowDeleteItem?: boolean
  isLoading?: boolean
}

interface BaseModalProps {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  preventScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  size: 'md',
  className: '',
  showCloseButton: true,
  closeOnOverlayClick: true,
  preventScroll: true,
  showInput: false,
  inputType: 'text',
  placeholder: '',
  maxLength: undefined,
  showCharCount: false,
  displayText: '',
  disabled: false,
  errorMessage: '',
  showError: false,
  defaultValue: '',
  isShowDeleteItem: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'input', value: string): void
  (e: 'submit', value: string): void
  (e: 'deleteFolder'): void
}>()

const inputId = `modal-input-${Math.random().toString(36).substr(2, 9)}`
const inputValue = ref(props.defaultValue)
// const { lock, unlock } = useScrollLock()
const isClosing = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

// mounted ------------------------------------------------------------
onMounted(() => {
  if (props.showInput) {
    inputRef.value?.focus()
  }
})

// methods ------------------------------------------------------------
const closeModal = () => {
  isClosing.value = true
  emit('update:modelValue', false)
  emit('close')
  inputValue.value = props.defaultValue || ''
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    closeModal()
  }
}

const handleInput = () => {
  emit('input', inputValue.value)
}

const deleteHandler = () => {
  emit('deleteFolder')
}

const submitHandler = () => {
  emit('submit', inputValue.value)
}

// watch

watch(
  () => props.defaultValue,
  (newValue) => {
    inputValue.value = newValue
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue && isClosing.value) {
      isClosing.value = false
    }
  }
)


</script>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
