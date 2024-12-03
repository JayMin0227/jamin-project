import { useState, useEffect } from "react";
import axios from "axios";
import { Idea } from "../types/idea";  // 修正
import {
  Button,
  Input,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

export default function Ideas() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
  
    async function fetchIdeas() {
      const res = await axios.get("http://localhost:8000/ideas");
      setIdeas(res.data);
    }
  
    async function saveIdea() {
      if (editId) {
        await axios.put(`http://localhost:8000/ideas/${editId}`, {
          title,
          content,
          tags,
        });
        setEditId(null);
      } else {
        await axios.post("http://localhost:8000/ideas", {
          title,
          content,
          tags,
        });
      }
      setTitle("");
      setContent("");
      setTags("");
      fetchIdeas();
    }
  
    async function searchIdeas() {
      const res = await axios.get("http://localhost:8000/ideas/search", {
        params: { keyword: searchKeyword },
      });
      setIdeas(res.data);
    }
  
    useEffect(() => {
      fetchIdeas();
    }, []);
  
    return (
      <div>
        <Input
          placeholder="Search by keyword"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <Button onClick={searchIdeas}>Search</Button>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Button onClick={saveIdea}>
          {editId ? "Update Idea" : "Add Idea"}
        </Button>
      </div>
    );
  }
  