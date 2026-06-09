<template>
  <div class="uploader">
    <h3>{{ title }}</h3>

    <input type="file" accept="image/jpeg" @change="loadImage" />

    <div v-if="imageUrl" class="preview">
      <img :src="imageUrl" ref="image" @load="analyzeImage" />
    </div>

    <canvas ref="canvas" style="display: none"></canvas>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
})

const emit = defineEmits(['rgbCalculated'])

const imageUrl = ref(null)
const rgb = ref(null)

const image = ref(null)
const canvas = ref(null)

function loadImage(event) {
  const file = event.target.files[0]

  if (!file) return

  imageUrl.value = URL.createObjectURL(file)
}

function analyzeImage() {
  const img = image.value
  const cnv = canvas.value

  const ctx = cnv.getContext('2d')

  cnv.width = img.width
  cnv.height = img.height

  ctx.drawImage(img, 0, 0)

  const centerX = Math.floor(img.width / 2)
  const centerY = Math.floor(img.height / 2)

  let rSum = 0
  let gSum = 0
  let bSum = 0

  const sampleCount = 10

  for (let i = 0; i < sampleCount; i++) {
    const x = centerX + Math.floor(Math.random() * 10 - 5)
    const y = centerY + Math.floor(Math.random() * 10 - 5)

    const pixel = ctx.getImageData(x, y, 1, 1).data

    rSum += pixel[0]
    gSum += pixel[1]
    bSum += pixel[2]
  }

  rgb.value = {
    r: Math.round(rSum / sampleCount),
    g: Math.round(gSum / sampleCount),
    b: Math.round(bSum / sampleCount),
  }

  emit('rgbCalculated', rgb.value)
}
</script>

<style scoped>
.uploader {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px 0;
}

.preview img {
  max-width: 250px;
  margin-top: 10px;
  object-fit: cover;
  object-position: center;
}
/* .preview img {
  max-width: 250px;
  max-height: 250px;
  object-fit: contain;
} */

input[type='file'] {
  margin-top: 10px;
  font-size: 15px;
}
</style>
