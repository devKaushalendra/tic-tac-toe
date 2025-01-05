import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, Animated } from 'react-native';

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [animation] = useState(new Animated.Value(1));

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
      animateWin();
    } else if (squaresCopy.every(Boolean)) {
      setScore((prevScore) => ({
        ...prevScore,
        draws: prevScore.draws + 1,
      }));
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
  };

  const renderSquare = (i) => {
    return (
      <TouchableOpacity onPress={() => handleClick(i)} style={styles.square}>
        <Animated.Text style={[styles.symbol, { transform: [{ scale: animation }] }]}>
          {squares[i]}
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

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every(Boolean)) {
    status = 'Draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
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
      <Button style={styles.button} title="Restart Game" onPress={restartGame} color="#841584" />
      <Text style={styles.score}>Score: X - {score.X} | O - {score.O} | Draws - {score.draws}</Text>
    </View>
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
    fontSize: 24,
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
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
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    margin: 2,
  },
  symbol: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333',
  },
  score: {
    fontSize: 18,
    marginTop: 20,
  },
  button: {
      marginTop: 20,
  },
});

export default TicTacToe;