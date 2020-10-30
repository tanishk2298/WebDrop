import java.util.*;
import java.io.*;
import java.lang.*;

class Solution
{
    public int kosaraju(ArrayList<ArrayList<Integer>> graph, int n)
    {
        ArrayList<ArrayList<Integer>> rev = new ArrayList<ArrayList<Integer>>();
        for(int i=0;i<graph.size();i++)
            rev.add(new ArrayList<Integer>());
        reverse(rev,graph);
        boolean[] vis = new boolean[graph.size()];
        Arrays.fill(vis, false);
        Stack<Integer> stk = new Stack<>();
        for(int i=0;i<graph.size();i++)
            if(vis[i] == false)
                dfs1(i,graph,vis,stk);
        Arrays.fill(vis, false);
        int count = 0;
        while(!stk.isEmpty()){
            int i = stk.pop();
            if(vis[i] == false){
                count++;
                dfs2(i,rev,vis);
            }
        }
        return count;
    }
    public static void dfs1(int curr, ArrayList<ArrayList<Integer>> graph, boolean[] vis, Stack<Integer> stk){
        vis[curr] = true;
        ArrayList<Integer> currList = graph.get(curr);
        for(int i=0;i<currList.size();i++)
            if(vis[currList.get(i)] == false)
                dfs1(currList.get(i),graph,vis,stk);
        stk.add(curr);
    }
    public static void dfs2(int curr, ArrayList<ArrayList<Integer>> rev, boolean[] vis){
        vis[curr] = true;
        ArrayList<Integer> currList = rev.get(curr);
        for(int i=0;i<currList.size();i++)
            if(vis[currList.get(i)] == false)
                dfs2(currList.get(i),rev,vis);
    }
    public static void reverse(ArrayList<ArrayList<Integer>> rev, ArrayList<ArrayList<Integer>> graph){
        for(int i=0;i<graph.size();i++){
            for(int j=0;j<graph.get(i).size();j++){
                int v = graph.get(i).get(j);
                rev.get(v).add(i);
            }
        }
    }
}

//Driver Function

class Gfg
{
    public static void main (String[] args){
        Scanner sc = new Scanner(System.in);
        int t = sc.nextInt(); 
        while(t-->0){
            ArrayList<ArrayList<Integer>> list = new ArrayList<>();
            int vertices = Integer.parseInt(sc.next());
            int edges = Integer.parseInt(sc.next());
            for(int i =0; i < vertices; i++)
                list.add(i, new ArrayList<Integer>());
            for(int i = 1; i <= edges; i++){
                 int u = Integer.parseInt(sc.next());
                 int v = Integer.parseInt(sc.next());
                 list.get(u).add(v);
            }  
            Solution T = new Solution();
            System.out.println(T.kosaraju(list, vertices));
	}
    }
}