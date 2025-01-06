import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Vibration, Linking } from 'react-native';
import { Provider as PaperProvider, Dialog, Portal, Button } from 'react-native-paper';
import { useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold 
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const TicTacToe = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [animation] = useState(new Animated.Value(1));
  const [visible, setVisible] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showDrawText, setShowDrawText] = useState(false);

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplashScreen();
  }, [fontsLoaded]);

  const handleClick = (i) => {
    const squaresCopy = squares.slice();
    if (calculateWinner(squaresCopy) || squaresCopy[i]) {
      return;
    }
    squaresCopy[i] = xIsNext ? 'X' : 'O';
    setSquares(squaresCopy);
    setXIsNext(!xIsNext);
    const winner = calculateWinner(squaresCopy);
    if (winner) {
      setScore((prevScore) => ({
        ...prevScore,
        [winner]: prevScore[winner] + 1,
      }));
      setWinner(winner);
      setVisible(true);
      Vibration.vibrate(); // Vibrate on win
      animateWin();
      setTimeout(restartGame, 2000); // Auto-reset after 2 seconds
    } else if (squaresCopy.every(Boolean)) {
      setScore((prevScore) => ({
        ...prevScore,
        draws: prevScore.draws + 1,
      }));
      setShowDrawText(true);
      Vibration.vibrate(); // Vibrate on draw
      setTimeout(restartGame, 2000); // Auto-reset after 2 seconds
    }
  };

  const animateWin = () => {
    Animated.timing(animation, {
      toValue: 1.5,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      animation.setValue(1); // Reset animation
    });
  };

  const restartGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setVisible(false);
    setShowDrawText(false);
  };

  const renderSquare = (i) => {
    return (
      <TouchableOpacity onPress={() => handleClick(i)} style={styles.square}>
        <Animated.Text style={[styles.symbol, { transform: [{ scale: animation }] }]}>
          {squares[i] === 'X' ? (
            <Text style={styles.xSymbol}>{squares[i]}</Text>
          ) : squares[i] === 'O' ? (
            <Text style={styles.oSymbol}>{squares[i]}</Text>
          ) : null}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
 ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  let status;
  if (squares.every(Boolean) && !winner) {
    status = 'Draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>TIC TAC TOE</Text>
        {showDrawText && <Text style={styles.drawText}>DRAW</Text>}
        <Text style={styles.status}>{status}</Text>
        <View style={styles.board}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </View>
        <Button mode="contained" onPress={restartGame} style={styles.button}>
          Restart Game
        </Button>
        <Text style={styles.score}>Score: X - {score.X} | O - {score.O} | Draws - {score.draws}</Text>
        <View style={styles.copyrightView}>
          <Text style={styles.copyright}>
            Created by: 
            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/dev-kaushalendra/')}>
              <Text style={styles.copyrightlink}> Kaushalendra</Text>
            </TouchableOpacity>
          </Text>
        </View>
        
        
        <Portal>
          <Dialog visible={visible} onDismiss={() => setVisible(false)} style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>🎉 Winner! 🎉</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogContent}>{winner ? `Congratulations ${winner}! You did it!` : 'It\'s a draw!'}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisible(false)}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFE0',
  },
  title: {
    fontSize: 48, // Adjust the font size as needed
    fontFamily: 'Poppins_500Medium', // Ensure this font is loaded
    textAlign: 'center',
    textShadowColor: '#000', // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 5, // Shadow blur radius
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
  },
  drawText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ce3a3b',
    marginBottom: 20,
    fontFamily: 'Poppins_500Medium',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 315,
    paddingBottom: 20,
  },
  square: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4e2c8',
    borderRadius: 10,
    margin: 2,
  },
  symbol: {
    fontSize: 60,
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold',
  },
  xSymbol: {
    color: '#bb8b32',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    transform: [{ rotateX: '10deg' }, { rotateY: '10deg' }],
  },
  oSymbol: {
    color: '#be7458',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    transform: [{ rotateX: '10deg' }, { rotateY: '10deg' }],
  },
  score: {
    fontSize: 18,
    marginTop: 20,
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    marginTop: 20,
  },
  copyrightView: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Poppins_400Regular',
  },
  copyrightlink: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Poppins_400Regular',
    bottom: -12,
    
  },
  dialog: {
    backgroundColor: '#FFF8DC',
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  dialogContent: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TicTacToe;