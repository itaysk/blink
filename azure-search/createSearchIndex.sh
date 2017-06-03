searchServiceName="blink"
searchServiceApiKey="0123456789ABCDEF0123456789ABCDEF"
searchIndexName="blink"
url="https://$searchServiceName.search.windows.net/indexes/$searchIndexName?api-version=2015-02-28" 
echo $url
curl -X Put -H "api-Key":$searchServiceApiKey -H "Content-Type":"application/json" -d @./searchIndexSpec.json $url
