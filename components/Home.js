// StAuth10244: I Robert Kumar, 000883986, certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. I have not made
//  my work available to anyone else."
import React, {useState, useEffect} from 'react';
import { Button, Text, View, ScrollView, StyleSheet, TextInput, FlatList } from 'react-native';
import Card from './Card';

const clientID = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

export default function Home() {
    const [accessToken, setAccessToken] = useState("");
    const [artists, setArtists] = useState([]);
    const [showContent, setShowContent] = useState(false);
    const [searchParams, setSearchParams] = useState("");
    
    // Only call getToken on component mount
    useEffect(() => {
        getToken();
    }, [])

    /**
     * Retrieves an accessToken from Spotify's authorization endpoint using a clientID and clientSecret
     * via a POST request. The token is stored as part of the component's state. 
     */
    async function getToken() {
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + clientID + '&client_secret=' + clientSecret
        };

        await fetch('https://accounts.spotify.com/api/token', authParameters)
            .then(result => result.json())
            .then(data => setAccessToken(data.access_token)
        );
    }

    /**
     * Retrieves a list of artists related to a given search term. The term is sent to Spotify's search
     * endpoint using a GET request. An array is returned, which is stored as part of the component's 
     * state. Additionally, this method enables the visiblity of the artist cards (see JSX below), which
     * are hidden until this function receives a response. A search can ONLY be performed if the user has
     * entered text into the search box.
     * @param {String} searchTerms 
     */
    async function searchArtist(searchTerms) {
        if (searchTerms != "") {
            var searchParameters = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            };

            await fetch('https://api.spotify.com/v1/search?q=' + searchTerms + '&type=artist&limit=5', searchParameters)
                .then(response => response.json())
                .then(data => {
                    setArtists(data);
                    setShowContent(true);
                    // console.log(data.artists.items[0]);
                }
            );
        } else {
            setShowContent(false);
        }
    }

    /**
     * Helper function to update the state for the search parameters which are used in searchArtist().
     * @param {String} searchTerms 
     */
    function searchHandler(searchTerms) {
        setSearchParams(searchTerms);
    }
    
    return(
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Lstn.io</Text>
            <Text style={styles.content}>Lstn to your favourite artist.</Text>
            <View >
                <TextInput
                    style={styles.search}
                    id="searchbox"
                    placeholder="Search for an artist..."
                    onChange={(event) => searchHandler(event.target.value)}
                />
            </View>
            <View style={styles.button}>
                <Button
                    color="#404040"
                    onPress={() => searchArtist(searchParams)} 
                    title="Search"
                />
            </View>
            {(showContent && artists !== null) &&
                <FlatList
                    data={artists.artists.items}
                    renderItem={({item}) => (
                        <Card 
                            spotifyLink={item.external_urls.spotify} 
                            name={item.name}
                            image={item.images}
                            followers={item.followers.total}
                            genres={item.genres}
                            id={item.id}
                            token={accessToken}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={1}
                    horizontal={false}/>
            }
        </ScrollView>
    )
};

/**
 * Styles for the Home component.
 */
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#909090',
        alignItems: 'center'
    },
    title: {
        paddingTop: 70,
        fontSize: 70,
        fontWeight: 'bold',
        textAlign: "center"
    },
    content: {
        fontSize: 20,
        textAlign: "center"
    },
    search: {
        flex: 1,
        height: 40,
        padding: 10,
        margin: 10,
        borderRadius: "20px",
        borderColor: "white",
        borderWidth: "1px",
        backgroundColor: "#EEE",
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        width: "90vw"
    },
    button: {
        width: 100
    }
  });
