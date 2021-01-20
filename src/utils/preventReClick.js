import Vue from 'vue'
const preventReClick = Vue.directive('preventReClick', {
    inserted: function (el, binding) {
      el.addEventListener('click', () => {
        if (!el.disabled) {
          el.disabled = true
          el.style.opacity = '0.5'
          el.style.cursor = 'not-allowed'
          setTimeout(() => {
            el.disabled = false
            el.style.opacity = '1'
            el.style.cursor = ''
          }, binding.value ||5000)
        }
      })
    }
  })

export { preventReClick }