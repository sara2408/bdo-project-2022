# get_ipython().system('pip install whoosh')
# get_ipython().system('pip install nltk')

# Import libraries and packages
import os
import pandas as pd
from pyexpat.errors import XML_ERROR_SYNTAX
from whoosh import index, scoring
from whoosh.analysis import StandardAnalyzer
from whoosh.fields import Schema, TEXT, ID
from whoosh.qparser import QueryParser
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize


def add_dataframe_to_index(df, index):
    # Add the file to the index
    writer = index.writer()
    for _, doc in df.iterrows():
        writer.add_document(
            Name=str(doc.Name),
            Description=str(doc.Description),
            BetaValue=str(doc['Beta Value']),
            ISIN=str(doc.ISIN),
            Text=str(doc.Text)
        )
    writer.commit()

def load_all_data():
     # pickle file with all the extracted text but only stopwords removed
    all_data = pd.read_pickle('./data/pickle/all_data.pkl')
    return all_data

def create_search_index(search_schema):
    # TODO: consider adding logic to trigger indexing if the data was updated
    # for example, we could re-index if the pickle file's last edited date is after the index was created
    if not os.path.exists('index'):
        all_data = load_all_data()
        # Create a new index
        os.mkdir('index')
        ix = index.create_in('index', schema=search_schema)
        add_dataframe_to_index(all_data, ix)
    else:           
        # Load an existing index
        ix = index.open_dir('index', schema=search_schema)
    return ix

def stem_query(query):
    porter = PorterStemmer()

    token_words=word_tokenize(query)
    token_words
    stem_query=[]
    for word in token_words:
        stem_query.append(porter.stem(word))
        stem_query.append(" ")
    return "".join(stem_query)

def search(query_str: str, match_limit:int=10):
    query_str = stem_query(query_str)

    search_schema = Schema(
        Name=TEXT(stored=True, analyzer=StandardAnalyzer()),
        ISIN=ID(stored=True),
        Description=TEXT(stored=True),
        BetaValue=TEXT(stored=True),
        Text=TEXT(analyzer=StandardAnalyzer())
    )
    ix = create_search_index(search_schema)

    w = scoring.BM25F
    # w = scoring.TF_IDF
    # w = scoring.Frequency
    with ix.searcher(weighting=w) as searcher:
        query = QueryParser("Text", ix.schema).parse(query_str)
        results = searcher.search(query, limit=match_limit)
        companies = [dict(r) for r in results]
        return companies