import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const candleHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 100vh;
      background: linear-gradient(to bottom, #0a0a15 0%, #1a1a2e 100%);
      overflow: hidden;
    }
    .scene {
      position: relative;
      width: 200px;
      height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      padding-bottom: 20px;
    }
    .candle {
      position: relative;
      width: 60px;
      background: linear-gradient(to right, #f5e6d3 0%, #fff8f0 30%, #f5e6d3 70%, #e8d4c0 100%);
      border-radius: 3px 3px 5px 5px;
      transition: height 0.1s linear;
      box-shadow: inset -5px 0 10px rgba(0,0,0,0.1), inset 5px 0 10px rgba(255,255,255,0.3);
    }
    .candle::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 70px;
      height: 8px;
      background: linear-gradient(to bottom, #e8d4c0, #f5e6d3);
      border-radius: 50%;
    }
    .wick-container {
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 25px;
    }
    .wick {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 20px;
      background: linear-gradient(to top, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);
      border-radius: 1px;
    }
    .flame-container {
      position: absolute;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 80px;
    }
    .flame {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 50px;
      background: linear-gradient(to top, 
        #ff6b35 0%, 
        #ff8c42 20%, 
        #ffd166 40%, 
        #fffacd 70%, 
        #ffffff 90%);
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
      filter: blur(1px);
      animation: flicker 0.1s infinite alternate, sway 0.5s infinite ease-in-out;
      box-shadow: 
        0 0 20px #ff6b35,
        0 0 40px #ff8c42,
        0 0 60px #ffd166,
        0 0 80px rgba(255,209,102,0.5);
    }
    .flame-inner {
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      width: 10px;
      height: 30px;
      background: linear-gradient(to top, 
        #87ceeb 0%, 
        #ffffff 50%, 
        #fffacd 100%);
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
      animation: flicker-inner 0.15s infinite alternate;
    }
    .glow {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 100px;
      background: radial-gradient(ellipse, rgba(255,150,50,0.4) 0%, transparent 70%);
      animation: glow-pulse 0.3s infinite alternate;
    }
    .wax-pool {
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 15px;
      background: radial-gradient(ellipse, rgba(255,248,240,0.9) 0%, rgba(245,230,211,0.8) 100%);
      border-radius: 50%;
      transition: all 0.5s ease;
    }
    .drip {
      position: absolute;
      width: 8px;
      background: linear-gradient(to bottom, #fff8f0, #f5e6d3);
      border-radius: 0 0 50% 50%;
      animation: drip-fall 2s ease-in forwards;
    }
    @keyframes flicker {
      0% { transform: translateX(-50%) scaleX(1) scaleY(1); opacity: 1; }
      25% { transform: translateX(-52%) scaleX(0.95) scaleY(1.02); opacity: 0.95; }
      50% { transform: translateX(-48%) scaleX(1.02) scaleY(0.98); opacity: 1; }
      75% { transform: translateX(-51%) scaleX(0.98) scaleY(1.01); opacity: 0.97; }
      100% { transform: translateX(-50%) scaleX(1) scaleY(0.99); opacity: 1; }
    }
    @keyframes flicker-inner {
      0% { transform: translateX(-50%) scaleY(1); }
      100% { transform: translateX(-50%) scaleY(0.9); }
    }
    @keyframes sway {
      0% { transform: translateX(-50%) rotate(-2deg); }
      50% { transform: translateX(-50%) rotate(2deg); }
      100% { transform: translateX(-50%) rotate(-2deg); }
    }
    @keyframes glow-pulse {
      0% { opacity: 0.6; transform: translateX(-50%) scale(1); }
      100% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
    }
    @keyframes drip-fall {
      0% { top: 0; opacity: 1; height: 10px; }
      100% { top: 100%; opacity: 0.8; height: 20px; }
    }
  </style>
</head>
<body>
  <div class="scene">
    <div class="candle" id="candle">
      <div class="wick-container">
        <div class="wick"></div>
        <div class="flame-container" id="flame-container">
          <div class="glow"></div>
          <div class="flame" id="flame"></div>
          <div class="flame-inner"></div>
        </div>
      </div>
    </div>
    <div class="wax-pool" id="wax-pool"></div>
  </div>
  <script>
    const candle = document.getElementById('candle');
    const flame = document.getElementById('flame');
    const flameContainer = document.getElementById('flame-container');
    const waxPool = document.getElementById('wax-pool');
    
    let initialHeight = 200;
    let currentHeight = initialHeight;
    const meltDuration = 10000;
    const startTime = Date.now();
    let dripCount = 0;
    
    candle.style.height = initialHeight + 'px';
    
    function createDrip() {
      if (Math.random() > 0.7 && dripCount < 10) {
        const drip = document.createElement('div');
        drip.className = 'drip';
        drip.style.left = (20 + Math.random() * 20) + 'px';
        drip.style.height = (8 + Math.random() * 8) + 'px';
        candle.appendChild(drip);
        dripCount++;
        setTimeout(() => {
          if (drip.parentNode) drip.remove();
          dripCount--;
        }, 2000);
      }
    }
    
    function melt() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / meltDuration, 1);
      
      currentHeight = initialHeight * (1 - progress * 0.85);
      candle.style.height = currentHeight + 'px';
      
      const flameScale = 1 - progress * 0.7;
      flame.style.transform = 'translateX(-50%) scale(' + flameScale + ')';
      flameContainer.style.opacity = flameScale;
      
      const poolWidth = 80 + progress * 60;
      const poolHeight = 15 + progress * 10;
      waxPool.style.width = poolWidth + 'px';
      waxPool.style.height = poolHeight + 'px';
      
      createDrip();
      
      if (progress < 1) {
        requestAnimationFrame(melt);
      } else {
        flameContainer.style.display = 'none';
      }
    }
    
    melt();
  </script>
</body>
</html>
`;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.webviewContainer}>
        <WebView
          source={{ html: candleHTML }}
          style={styles.webview}
          scrollEnabled={false}
          originWhitelist={["*"]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a15",
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});