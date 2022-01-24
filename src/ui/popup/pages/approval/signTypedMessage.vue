<style lang="scss" scoped>
.current-key-box {
  padding: 7px 8px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid rgba(191, 191, 191, 0.29);
  background: rgba(247, 245, 244, 0.9) rgba(255, 255, 255, 0.9);
  >img {
    margin-right: 5px;
    width: 26px;
    height: 26px;
  }
  >div {
    >p {
      margin-bottom: 4px;
      font-size: $detail-font-size;
      line-height: 16px;
      color: #8D919C;
    }
    >span {
      font-size: $detail-font-size;
      font-weight: 600;
      line-height: 16px;
      color: #6F7684;
    }
  }
}
.main-title-box {
  margin:24px 0 8px;
  display: flex;
  justify-content: space-between;
  h2 {
    font-size: $detail-font-size;
    line-height: 16px;
    color: #6F7684;
  }
  p {
    font-size: $detail-font-size;
    line-height: 16px;
    color: #2A67C5;
    cursor: pointer;
  }
}
.main-message-box {
  border-radius: 8px;
  border: 1px solid #E4E9F0;
  background: #F1F4F8;
  .main-message-title{
    padding: 15px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: $detail-font-size;
    line-height: 16px;
    h2 {
      font-weight: 600;
    }
  }
  .main-message-content {
    margin: 0 12px;
    padding: 18px 0;
    border-top: 1px solid rgba(220, 229, 240, 0.5);
    display: flex;
    justify-content: space-between;
    font-size: $detail-font-size;
    font-weight: 600;
    line-height: 16px;
    word-wrap: break-word;
    word-break: break-all;
    h2 {
      width: 180px;
      text-align: right;
    }
  }
}
.raw-box {
  .raw-container {
    padding: 24px;
    border-radius: 8px;
    .jv-container {
      overflow: hidden;
      overflow-y: scroll;
      max-height: 244px;
      background: #F1F4F8;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>

<template>
  <div>
    <SignWrapper @reject="onRejectClick" @allow="onAllowClick">
      <div class="current-key-box">
        <img src="/assets/page-addAddress/key-btc.png">
        <div>
          <p>{{ $tt('Current Key') }}</p>
          <span>0xe7c00a33…a09dc4f6bd</span>
        </div>
      </div>
      <div class="main-title-box">
        <h2>{{ $tt('Sign Typed Message') }}</h2>
        <p @click="isShowRawDialog = true">
          {{ $tt('View Raw') }}
        </p>
      </div>
      <div class="main-message-box">
        <div class="main-message-title">
          <span>{{ $tt('App') }}</span>
          <h2>{{ $tt('DAS') }}</h2>
        </div>
        <div class="main-message-content">
          <span>{{ $tt('Details') }}</span>
          <h2>{{ $tt('Transfer Owner of jack.bit to') }} 0xE7c00a33B82AfF42C8Ea4e7B41dB1ea09Dc4f6BD</h2>
        </div>
      </div>
    </SignWrapper>
    <UniDialog class="raw-box" :visible="isShowRawDialog" @cancel="handleRawCancel">
      <div class="raw-container">
        <json-viewer :value="jsonData"></json-viewer>
      </div>
    </UniDialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import JsonViewer from 'vue-json-viewer'
import SignWrapper from './-/SignWrapper.vue'

export default {
  name: 'PageSignTypedMessage',
  components: {
    SignWrapper,
    JsonViewer,
  },
  setup () {
    function onRejectClick (e) {
    }
    function onAllowClick (e) {
    }

    const isShowRawDialog = ref(false)
    const handleRawCancel = () => {
      isShowRawDialog.value = false
    }
    const jsonData = ref({})
    jsonData.value = {
      total: 25,
      limit: 10,
      skip: 0,
      links: {
        previous: undefined,
        next () {},
      },
      data: [
        {
          id: '5968fcad629fa84ab65a5247',
          firstname: 'Ada',
          lastname: 'Lovelace',
          awards: null,
          known: [
            'mathematics',
            'computing',
          ],
          position: {
            lat: 44.563836,
            lng: 6.495139,
          },
          description: `Augusta Ada King, Countess of Lovelace (née Byron; 10 December 1815 – 27 November 1852) was an English mathematician and writer,
            chiefly known for her work on Charles Babbage's proposed mechanical general-purpose computer,
            the Analytical Engine. She was the first to recognise that the machine had applications beyond pure calculation,
            and published the first algorithm intended to be carried out by such a machine.
            As a result, she is sometimes regarded as the first to recognise the full potential of a "computing machine" and the first computer programmer.`,
          bornAt: '1815-12-10T00:00:00.000Z',
          diedAt: '1852-11-27T00:00:00.000Z',
        }, {
          id: '5968fcad629fa84ab65a5246',
          firstname: 'Grace',
          lastname: 'Hopper',
          awards: [
            'Defense Distinguished Service Medal',
            'Legion of Merit',
            'Meritorious Service Medal',
            'American Campaign Medal',
            'World War II Victory Medal',
            'National Defense Service Medal',
            'Armed Forces Reserve Medal',
            'Naval Reserve Medal',
            'Presidential Medal of Freedom',
          ],
          known: null,
          position: {
            lat: 43.614624,
            lng: 3.879995,
          },
          description: `Grace Brewster Murray Hopper (née Murray; December 9, 1906 – January 1, 1992)
            was an American computer scientist and United States Navy rear admiral.
            One of the first programmers of the Harvard Mark I computer,
            she was a pioneer of computer programming who invented one of the first compiler related tools.
            She popularized the idea of machine-independent programming languages, which led to the development of COBOL,
            an early high-level programming language still in use today.`,
          bornAt: '1815-12-10T00:00:00.000Z',
          diedAt: '1852-11-27T00:00:00.000Z',
        },
      ],
    }

    return {
      onRejectClick,
      onAllowClick,

      isShowRawDialog,
      handleRawCancel,
      jsonData,
    }
  },
}
</script>
